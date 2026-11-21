import type { ParsedReport, ProjectDoc, ProjectFeature } from './types';

// Build the follow-up Lovable prompt that targets just the features the last
// build report didn't complete. Kept deterministic (no LLM call) — the prompt
// template is all we need for a focused next step.
export const buildGapPrompt = (
  project: ProjectDoc,
  report: ParsedReport
): string | undefined => {
  const statusById = new Map(report.features.map((f) => [f.id, f.status]));
  const gaps: ProjectFeature[] = project.features.filter((f) => {
    const s = statusById.get(f.id) ?? f.status;
    return s === 'missing' || s === 'partial' || s === 'blocked';
  });

  if (gaps.length === 0) return undefined;

  const bullets = gaps
    .map((f) => {
      const s = statusById.get(f.id);
      const noteFromReport = report.features.find((r) => r.id === f.id)?.note;
      const label =
        s === 'partial' ? 'finish' : s === 'blocked' ? 'unblock' : 'add';
      const note = noteFromReport ? ` — last build: ${noteFromReport}` : '';
      return `- **${label}** [${f.id}] ${f.label}${note}`;
    })
    .join('\n');

  const blockerLines =
    report.blockers.length > 0
      ? `\n\n**Known blockers from the last build:**\n${report.blockers
          .map((b) => `- ${b}`)
          .join('\n')}`
      : '';

  return `# Follow-up build prompt — ${project.title}

Your previous build was incomplete. Focus only on the items below. Do not refactor or rebuild features that already work.

## Items to complete

${bullets}${blockerLines}

## Rules

- Keep every working feature intact.
- Match the existing design and code style of the project.
- After you finish, append a completion report in the same \`companai-report-v1\` fenced JSON block I asked for last time, with the same feature ids.
`;
};
