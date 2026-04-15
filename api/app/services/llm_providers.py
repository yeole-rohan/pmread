"""
Multi-model provider abstraction.

Embeddings priority:  xAI (free tier) → OpenAI → fail gracefully
Generation priority:  Anthropic Claude (streaming) → xAI Grok (streaming fallback)

All xAI calls use the OpenAI SDK pointed at https://api.x.ai/v1.
The xAI API is fully OpenAI-compatible; only the base_url and API key differ.

Adding a new provider later:
  1. Add its API key + model name to config.py
  2. Register it in EMBED_PROVIDERS or GEN_PROVIDERS below
  3. Adjust the priority list
"""
from __future__ import annotations

import asyncio
import logging
from typing import AsyncIterator

from app.config import settings

logger = logging.getLogger(__name__)

# ── Provider registries ────────────────────────────────────────────────────────

EMBED_PROVIDERS: list[dict] = [
    # OpenAI — only provider with a stable embeddings API.
    # xAI (Grok) is generation-only; it does not expose an embeddings endpoint.
    {
        "name": "openai",
        "key_attr": "OPENAI_API_KEY",
        "base_url": "https://api.openai.com/v1",
        "model": "text-embedding-3-small",
    },
]

GEN_PROVIDERS: list[dict] = [
    # Claude — best for nuanced PRDs; streaming via Anthropic SDK
    {
        "name": "anthropic",
        "key_attr": "ANTHROPIC_API_KEY",
        "model": "claude-sonnet-4-6",
    },
    # Grok — fallback on rate-limit / outage; streaming via OpenAI-compatible SDK
    {
        "name": "xai",
        "key_attr": "XAI_API_KEY",
        "base_url": "https://api.x.ai/v1",
        "model": "grok-3-latest",  # upgrade to grok-3-mini for lower latency if needed
    },
]


def _get_key(provider: dict) -> str | None:
    return getattr(settings, provider["key_attr"], "") or ""


# ── Embeddings ─────────────────────────────────────────────────────────────────

def embed_batch_sync(texts: list[str]) -> list[list[float]]:
    """
    Embed a batch of texts. Tries providers in EMBED_PROVIDERS order.
    Runs synchronously so it can be called via run_in_executor.
    Raises RuntimeError if no provider succeeds.
    """
    from openai import OpenAI

    for provider in EMBED_PROVIDERS:
        key = _get_key(provider)
        if not key:
            continue
        try:
            client = OpenAI(
                api_key=key,
                base_url=provider.get("base_url"),
                timeout=30.0,
            )
            resp = client.embeddings.create(
                model=provider["model"],
                input=texts,
            )
            vectors = [item.embedding for item in sorted(resp.data, key=lambda x: x.index)]
            logger.debug("Embedded %d texts via %s", len(texts), provider["name"])
            return vectors
        except Exception as e:
            logger.warning("Embedding failed on %s: %s — trying next provider", provider["name"], e)

    raise RuntimeError("All embedding providers failed or no API keys configured")


async def embed_batch(texts: list[str]) -> list[list[float]]:
    """Async wrapper around embed_batch_sync."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, embed_batch_sync, texts)


def embedding_available() -> bool:
    """Return True if at least one embedding provider has an API key."""
    return any(_get_key(p) for p in EMBED_PROVIDERS)


# ── Generation (streaming) ─────────────────────────────────────────────────────

class GenerationResult:
    def __init__(self, full_text: str, tokens_used: int, provider: str):
        self.full_text = full_text
        self.tokens_used = tokens_used
        self.provider = provider


async def stream_generation(
    system_prompt: str,
    user_message: str,
    max_tokens: int = 4096,
    on_chunk: "asyncio.coroutines.Coroutine | None" = None,
) -> GenerationResult:
    """
    Stream a generation request, yielding text chunks via on_chunk callback.
    Tries providers in GEN_PROVIDERS order; skips any without a key configured.

    on_chunk: async callable(text: str) called for each streamed chunk.
    Returns GenerationResult with the final full text + token count.
    """
    last_error: Exception | None = None

    for provider in GEN_PROVIDERS:
        key = _get_key(provider)
        if not key:
            continue

        try:
            if provider["name"] == "anthropic":
                result = await _stream_anthropic(system_prompt, user_message, max_tokens, on_chunk)
            else:
                result = await _stream_openai_compat(provider, system_prompt, user_message, max_tokens, on_chunk)

            logger.debug("Generation completed via %s (%d tokens)", provider["name"], result.tokens_used)
            return result

        except Exception as e:
            logger.warning(
                "Generation failed on %s: %s — trying next provider",
                provider["name"], type(e).__name__,
            )
            last_error = e
            continue

    raise RuntimeError(f"All generation providers failed. Last error: {last_error}")


async def _stream_anthropic(
    system_prompt: str,
    user_message: str,
    max_tokens: int,
    on_chunk,
) -> GenerationResult:
    import anthropic as _anthropic
    client = _anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    full_response = ""
    buffer = ""

    with client.messages.stream(
        model=GEN_PROVIDERS[0]["model"],
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    ) as stream:
        for text in stream.text_stream:
            full_response += text
            buffer += text
            if len(buffer) >= 50 and on_chunk:
                await on_chunk(buffer)
                buffer = ""

        if buffer and on_chunk:
            await on_chunk(buffer)

        final = stream.get_final_message()
        tokens = (final.usage.input_tokens or 0) + (final.usage.output_tokens or 0)

    return GenerationResult(full_text=full_response, tokens_used=tokens, provider="anthropic")


async def _stream_openai_compat(
    provider: dict,
    system_prompt: str,
    user_message: str,
    max_tokens: int,
    on_chunk,
) -> GenerationResult:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=_get_key(provider), base_url=provider["base_url"])

    full_response = ""
    buffer = ""
    # xAI / OpenAI-compat doesn't give precise token counts in stream;
    # we track completion_tokens via usage in the final chunk when stream_options is set.
    tokens_used = 0

    stream = await client.chat.completions.create(
        model=provider["model"],
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        stream=True,
        stream_options={"include_usage": True},
    )

    async for chunk in stream:
        if chunk.usage:
            tokens_used = (chunk.usage.prompt_tokens or 0) + (chunk.usage.completion_tokens or 0)
        if not chunk.choices:
            continue
        delta = chunk.choices[0].delta.content or ""
        full_response += delta
        buffer += delta
        if len(buffer) >= 50 and on_chunk:
            await on_chunk(buffer)
            buffer = ""

    if buffer and on_chunk:
        await on_chunk(buffer)

    return GenerationResult(full_text=full_response, tokens_used=tokens_used, provider=provider["name"])
