import type { Project, ProjectFeature } from './firestore';
import { featureLabels } from './firestore';

export const BUILD_REPORT_FENCE = 'companai-report-v1';

// The appendix we attach to every generated Lovable/Cursor prompt. It tells
// the builder to emit a structured JSON report after building so Companai can
// show a feature-by-feature diff of "built vs missing". Feature ids are baked
// in from the project so the builder only fills in statuses — no fuzzy string
// matching when we parse it back.
//
// Kept deterministic (no LLM): this exact text goes out every time, so the
// fence regex in the Cloud Function can rely on it.
export const buildPromptAppendix = (project: Project): string => {
  const featureRows = project.features
    .map(
      (f: ProjectFeature) =>
        `    { "id": "${f.id}", "label": ${JSON.stringify(f.label)}, "status": "" }`
    )
    .join(',\n');

  return `
---

## 📋 COMPLETION REPORT (required)

After you finish building, append a completion report to your response inside
the exact fenced block below. Do not modify the \`id\` or \`label\` fields. Do
not add fields. Do not wrap in prose. Fill in each feature's \`status\`.

For each feature, \`status\` must be one of:
- \`built\` — fully implemented and visible in the preview
- \`partial\` — started but not complete (explain in \`note\`)
- \`missing\` — not built yet
- \`blocked\` — attempted but failed (explain in \`note\`)

\`\`\`${BUILD_REPORT_FENCE}
{
  "projectId": "${project.id}",
  "features": [
${featureRows}
  ],
  "blockers": [],
  "filesChanged": []
}
\`\`\`
`;
};

// Attach the appendix to a lovable prompt that may already contain cursor
// instructions after a "---" divider. The appendix goes BEFORE the divider so
// Lovable (which reads the first part) sees the instructions, while Cursor
// (which reads the second part) does not duplicate them.
export const attachAppendixToSplitPrompt = (
  combined: string,
  project: Project
): string => {
  if (project.features.length === 0) return combined;
  const appendix = buildPromptAppendix(project);
  const dividerIdx = combined.indexOf('\n---\n');
  if (dividerIdx === -1) {
    // Single prompt — append at end.
    return `${combined.trimEnd()}\n${appendix}`;
  }
  const lovable = combined.slice(0, dividerIdx).trimEnd();
  const rest = combined.slice(dividerIdx);
  return `${lovable}\n${appendix}${rest}`;
};

// Unused directly by buildPromptAppendix (we iterate features for ids), but
// re-exported so Workspace can keep its existing featureLabels import tidy.
export { featureLabels };
