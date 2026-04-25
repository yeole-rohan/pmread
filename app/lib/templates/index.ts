export type { Template } from "./types";

import { technicalExecutionTemplates } from "./technical-execution";
import { planningTemplates } from "./planning";
import { researchTemplates } from "./research";
import { growthTemplates } from "./growth";
import { discoveryTemplates } from "./discovery";
import { pmEngineeringTemplates } from "./pm-engineering";
import { pmAiTemplates } from "./pm-ai";
import { pmIndiaTemplates } from "./pm-india";
import { metricsTemplates } from "./metrics";

export const TEMPLATES = [
  ...technicalExecutionTemplates,
  ...planningTemplates,
  ...researchTemplates,
  ...growthTemplates,
  ...discoveryTemplates,
  ...pmEngineeringTemplates,
  ...pmAiTemplates,
  ...pmIndiaTemplates,
  ...metricsTemplates,
];

export function getTemplate(slug: string) {
  return TEMPLATES.find((t) => t.slug === slug);
}

export const TEMPLATE_CATEGORIES = [
  "Planning",
  "Technical Execution",
  "Research",
  "Discovery",
  "Growth",
  "PM × Engineering",
  "PM × AI",
  "PM × India",
  "Metrics & Growth",
] as const;