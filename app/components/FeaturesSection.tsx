"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, X, ZoomIn } from "lucide-react";

const FEATURES = [
  {
    tag: "Evidence-backed",
    title: "PRDs built on real customer data",
    desc: "Every section links back to actual customer quotes. Not ChatGPT filling in templates — insights extracted from your own research.",
    items: [
      "Pain points with supporting verbatim quotes",
      "Feature requests ranked by mention frequency",
      "Engineering tasks scoped from your actual ask",
    ],
    image: "/prd-with-quotes.png",
    imageAlt: "PRD with evidence quotes — screenshot of PMRead PRD output",
  },
  {
    tag: "Multi-source",
    title: "All your feedback in one place",
    desc: "Connect every channel where customers talk. PMRead ingests them all and builds a unified insight board across all your sources.",
    items: [
      "PDF uploads: reports, surveys, NPS verbatims",
      "Call transcripts: Zoom, Fireflies, Gong, Loom",
      "Slack channel exports and GitHub codebase context (Pro)",
    ],
    image: "/multi-form-ingestion-ui.png",
    imageAlt: "Multi-source ingestion UI — screenshot of PMRead upload panel",
  },
  {
    tag: "Instant",
    title: "From research to PRD in under 2 minutes",
    desc: "Upload your files, let PMRead extract insights, then generate a complete PRD in one click. What used to take a day takes minutes.",
    items: [
      "Insights extracted in ~30 seconds after upload",
      "One-click PRD generation with streaming output",
      "Ask any question about your research with the Ask tab",
    ],
    image: "/generating-prd-ui.png",
    imageAlt: "PRD generation in progress — screenshot of PMRead streaming output",
  },
];

export default function FeaturesSection() {
  const [modalSrc, setModalSrc] = useState<string | null>(null);
  const [modalAlt, setModalAlt] = useState("");

  return (
    <>
      <div className="space-y-20">
        {FEATURES.map(({ tag, title, desc, items, image, imageAlt }, i) => (
          <div
            key={tag}
            className={`flex flex-col md:flex-row items-center gap-12 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="flex-1">
              <div className="inline-block px-2.5 py-1 rounded-full bg-purple-50 text-[#7F77DD] text-xs font-semibold mb-4 uppercase tracking-wide">
                {tag}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">{desc}</p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle size={15} className="text-[#1D9E75] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 w-full">
              <button
                type="button"
                onClick={() => { setModalSrc(image); setModalAlt(imageAlt); }}
                className="group relative w-full rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-[#7F77DD]/40 transition-all block"
                aria-label={`View full screenshot: ${imageAlt}`}
              >
                <Image
                  src={image}
                  alt={imageAlt}
                  width={640}
                  height={400}
                  className="w-full h-auto object-cover"
                  quality={90}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                    <ZoomIn size={18} className="text-[#7F77DD]" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setModalSrc(null)}
        >
          <div
            className="relative max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalSrc(null)}
              className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <Image
              src={modalSrc}
              alt={modalAlt}
              width={1280}
              height={800}
              className="w-full h-auto"
              quality={95}
            />
          </div>
        </div>
      )}
    </>
  );
}
