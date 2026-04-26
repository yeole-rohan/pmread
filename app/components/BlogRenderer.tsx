import Link from "next/link";
import React from "react";

function inlineHtml(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class='bg-gray-100 px-1.5 py-0.5 rounded text-[0.8em] font-mono text-gray-700'>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) =>
      href.startsWith("/")
        ? `<a href="${href}" class="text-[#7F77DD] underline underline-offset-2 hover:text-[#6b64c4]">${label}</a>`
        : `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-[#7F77DD] underline underline-offset-2 hover:text-[#6b64c4]">${label}</a>`
    );
}

export function extractToc(body: string): { id: string; text: string; level: 2 | 3 }[] {
  const toc: { id: string; text: string; level: 2 | 3 }[] = [];
  for (const line of body.split("\n")) {
    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      toc.push({ id: slugify(text), text, level: 2 });
    } else if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      toc.push({ id: slugify(text), text, level: 3 });
    }
  }
  return toc;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogRenderer({ body }: { body: string }) {
  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H2
    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      elements.push(
        <h2
          key={i}
          id={slugify(text)}
          className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-24"
        >
          {text}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      elements.push(
        <h3
          key={i}
          id={slugify(text)}
          className="text-base font-semibold text-gray-900 mt-6 mb-2 scroll-mt-24"
        >
          {text}
        </h3>
      );
      i++;
      continue;
    }

    // HR
    if (line.trim() === "---") {
      elements.push(<hr key={i} className="my-8 border-gray-100" />);
      i++;
      continue;
    }

    // Blockquote callout
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      const joined = quoteLines.join(" ");
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="border-l-4 border-[#7F77DD]/50 pl-4 py-1 my-4 bg-purple-50/40 rounded-r-lg"
        >
          <p
            className="text-sm text-gray-600 italic leading-relaxed"
            dangerouslySetInnerHTML={{ __html: inlineHtml(joined) }}
          />
        </blockquote>
      );
      continue;
    }

    // Table
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        const cells = lines[i]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        if (!cells.every((c) => /^[-: ]+$/.test(c))) rows.push(cells);
        i++;
      }
      const [header, ...body] = rows;
      if (!header) continue;
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {header.map((h, j) => (
                  <th
                    key={j}
                    className="text-left px-3 py-2.5 font-semibold text-gray-700 border border-gray-200 text-xs"
                    dangerouslySetInnerHTML={{ __html: inlineHtml(h) }}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className="even:bg-gray-50/50">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-3 py-2 border border-gray-200 text-gray-600 align-top text-sm"
                      dangerouslySetInnerHTML={{ __html: inlineHtml(cell) }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Fenced code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // consume closing ```
      elements.push(
        <pre
          key={`code-${i}`}
          className="my-4 rounded-xl bg-gray-900 p-4 overflow-x-auto text-xs leading-relaxed"
        >
          <code className={`text-gray-100 font-mono${lang ? ` language-${lang}` : ""}`}>
            {codeLines.join("\n")}
          </code>
        </pre>
      );
      continue;
    }

    // Bullet list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 my-4 pl-1">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7F77DD]/60 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: inlineHtml(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1.5 my-4 pl-1 counter-reset-item">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#7F77DD]/10 text-[#7F77DD] font-bold text-xs flex items-center justify-center mt-0.5">
                {j + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: inlineHtml(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p
        key={i}
        className="text-sm text-gray-600 leading-relaxed my-3"
        dangerouslySetInnerHTML={{ __html: inlineHtml(line) }}
      />
    );
    i++;
  }

  return <div className="blog-body">{elements}</div>;
}
