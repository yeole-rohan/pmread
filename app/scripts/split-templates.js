#!/usr/bin/env node
/**
 * Splits app/lib/templates.ts into per-category files under app/lib/templates/.
 * Run once from the app/ directory: node scripts/split-templates.js
 */

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "../lib/templates.ts");
const DEST_DIR = path.join(__dirname, "../lib/templates");

const raw = fs.readFileSync(SRC, "utf8");
const lines = raw.split("\n");

// ── 1. Extract the Template interface (lines 1–12) ──────────────────────────
const interfaceLines = [];
let i = 0;
while (i < lines.length && !lines[i].startsWith("export const TEMPLATES")) {
  interfaceLines.push(lines[i]);
  i++;
}
const interfaceBlock = interfaceLines.join("\n").trim();

// ── 2. Extract everything after the closing ];\n ────────────────────────────
const closingIdx = lines.findIndex((l) => l.startsWith("export function getTemplate"));
const footerBlock = lines.slice(closingIdx).join("\n").trim();

// ── 3. Split the TEMPLATES array into individual template objects ────────────
// Find all top-level `  {` boundaries
const templateStarts = [];
for (let j = i; j < closingIdx; j++) {
  if (lines[j] === "  {") templateStarts.push(j);
}

const templateObjects = [];
for (let k = 0; k < templateStarts.length; k++) {
  const start = templateStarts[k];
  const end = k + 1 < templateStarts.length ? templateStarts[k + 1] - 1 : closingIdx - 1;
  const block = lines.slice(start, end + 1).join("\n");
  // Extract category from the block
  const catMatch = block.match(/category:\s*"([^"]+)"/);
  const category = catMatch ? catMatch[1] : "Uncategorized";
  templateObjects.push({ category, block });
}

// ── 4. Group by category ────────────────────────────────────────────────────
const groups = {};
for (const { category, block } of templateObjects) {
  if (!groups[category]) groups[category] = [];
  groups[category].push(block);
}

// ── 5. Category → filename mapping ─────────────────────────────────────────
const CATEGORY_FILE = {
  "Technical Execution": "technical-execution",
  "Planning":            "planning",
  "Research":            "research",
  "Discovery":           "discovery",
  "Growth":              "growth",
  "Metrics & Growth":    "metrics",
  "PM × Engineering":    "pm-engineering",
  "PM × AI":             "pm-ai",
  "PM × India":          "pm-india",
};

// ── 6. Write category files ─────────────────────────────────────────────────
fs.mkdirSync(DEST_DIR, { recursive: true });

const importLines = [];

for (const [category, blocks] of Object.entries(groups)) {
  const filename = CATEGORY_FILE[category] || category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const constName = filename
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("")
    .replace(/×/g, "") + "Templates";

  const exportName = filename
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^./, (c) => c.toUpperCase()) + "Templates";

  // Build camelCase export name
  const camel = filename.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const exportVar = camel + "Templates";

  const content = [
    `import type { Template } from "../templates";`,
    ``,
    `export const ${exportVar}: Template[] = [`,
    blocks.join(",\n\n"),
    `];`,
  ].join("\n");

  fs.writeFileSync(path.join(DEST_DIR, `${filename}.ts`), content, "utf8");
  importLines.push({ exportVar, filename });
  console.log(`✅  Wrote ${filename}.ts (${blocks.length} templates)`);
}

// ── 7. Write index.ts ───────────────────────────────────────────────────────
const imports = importLines
  .map(({ exportVar, filename }) => `import { ${exportVar} } from "./${filename}";`)
  .join("\n");

const allVars = importLines.map(({ exportVar }) => exportVar).join(",\n  ");

// Extract TEMPLATE_CATEGORIES from footer
const catMatch = raw.match(/export const TEMPLATE_CATEGORIES[\s\S]+?as const;/);
const categoriesBlock = catMatch ? catMatch[0] : "";

const indexContent = [
  `export type { Template } from "../templates";`,
  ``,
  imports,
  ``,
  `export const TEMPLATES = [`,
  `  ...` + importLines.map(({ exportVar }) => exportVar).join(",\n  ..."),
  `];`,
  ``,
  `export function getTemplate(slug: string) {`,
  `  return TEMPLATES.find((t) => t.slug === slug);`,
  `}`,
  ``,
  categoriesBlock,
].join("\n");

fs.writeFileSync(path.join(DEST_DIR, "index.ts"), indexContent, "utf8");
console.log(`✅  Wrote templates/index.ts`);

// ── 8. Replace templates.ts with a thin barrel ─────────────────────────────
const barrelContent = [
  interfaceBlock,
  ``,
  `export { TEMPLATES, getTemplate, TEMPLATE_CATEGORIES } from "./templates/index";`,
].join("\n");

fs.writeFileSync(SRC, barrelContent, "utf8");
console.log(`✅  templates.ts replaced with barrel export`);

console.log(`\nDone. ${templateObjects.length} templates split across ${Object.keys(groups).length} files.`);
