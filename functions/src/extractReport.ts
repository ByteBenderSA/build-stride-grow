import { getGeminiClient } from './gemini';
import type { FeatureStatus, ParsedReport, ProjectFeature } from './types';

const VALID_STATUSES: FeatureStatus[] = [
  'pending',
  'built',
  'partial',
  'missing',
  'blocked',
];

// The fence token we tell Lovable/Cursor to emit around the JSON report.
// Versioned so we can evolve the schema without breaking older reports.
const REPORT_FENCE_RE = /```companai-report-v1\s*([\s\S]*?)```/;

// Tight validator: only accepts entries with known feature ids and valid status.
// `unknown` input is normalized; anything unrecognizable is dropped silently.
const validateReport = (
  raw: unknown,
  knownFeatureIds: Set<string>
): ParsedReport => {
  const out: ParsedReport = {
    features: [],
    blockers: [],
    filesChanged: [],
  };
  if (!raw || typeof raw !== 'object') return out;
  const r = raw as Record<string, unknown>;

  if (typeof r.projectId === 'string') out.projectId = r.projectId;

  if (Array.isArray(r.features)) {
    for (const entry of r.features) {
      if (!entry || typeof entry !== 'object') continue;
      const e = entry as Record<string, unknown>;
      const id = typeof e.id === 'string' ? e.id : undefined;
      const status = typeof e.status === 'string' ? e.status : undefined;
      if (!id || !knownFeatureIds.has(id)) continue;
      if (!status || !VALID_STATUSES.includes(status as FeatureStatus)) continue;
      out.features.push({
        id,
        status: status as FeatureStatus,
        note: typeof e.note === 'string' ? e.note.slice(0, 500) : undefined,
      });
    }
  }

  if (Array.isArray(r.blockers)) {
    out.blockers = r.blockers
      .filter((b): b is string => typeof b === 'string')
      .slice(0, 20)
      .map((b) => b.slice(0, 500));
  }

  if (Array.isArray(r.filesChanged)) {
    out.filesChanged = r.filesChanged
      .filter((f): f is string => typeof f === 'string')
      .slice(0, 100)
      .map((f) => f.slice(0, 300));
  }

  return out;
};

// Strict path: find the fence, JSON.parse what's inside, validate.
// Returns null if there's no fence or the content isn't valid JSON.
const extractFromFence = (
  raw: string,
  knownFeatureIds: Set<string>
): ParsedReport | null => {
  const match = raw.match(REPORT_FENCE_RE);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]);
    return validateReport(parsed, knownFeatureIds);
  } catch {
    return null;
  }
};

// Fallback path: ask Gemini to extract the report in strict JSON mode. We give
// it the known feature ids so it can only use those. Response schema is
// enforced by the SDK's responseMimeType.
const extractWithGemini = async (
  raw: string,
  features: ProjectFeature[]
): Promise<ParsedReport> => {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
  });

  const featureList = features
    .map((f) => `- ${f.id}: ${f.label}`)
    .join('\n');

  const prompt = `You extract build-report data from Lovable/Cursor output.

The user pasted this response from an AI builder:
<<<PASTE_START
${raw.slice(0, 20000)}
PASTE_END>>>

The project has these features (id: label):
${featureList}

Produce a JSON object with this shape — do not invent feature ids, only use the ones above:
{
  "features": [{ "id": "f1", "status": "built"|"partial"|"missing"|"blocked", "note": "optional short reason" }],
  "blockers": ["short strings describing errors or things the builder got stuck on"],
  "filesChanged": ["file paths mentioned in the paste"]
}

Rules:
- Include an entry for every feature id above. If the paste doesn't clearly say the feature works, mark it "missing".
- Use "built" only when the paste explicitly confirms the feature works in the preview.
- Use "partial" when started but incomplete.
- Use "blocked" when the builder tried and failed.
- note: at most one short sentence.
- blockers: at most 10 entries.
- filesChanged: file paths only, no prose.

Return ONLY the JSON object, no prose, no code fence.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Model sometimes wraps in a fence despite instructions.
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) {
      try {
        parsed = JSON.parse(fenced[1]);
      } catch {
        parsed = null;
      }
    }
  }

  const knownIds = new Set(features.map((f) => f.id));
  return validateReport(parsed, knownIds);
};

// Two-step extraction:
// 1. Strict JSON fence (free, instant) — the appendix we inject into prompts
//    tells the builder to emit this.
// 2. Gemini fallback (tokens, ~2s) — for pastes that don't contain a fence.
// Always returns a validated ParsedReport; unknown feature ids and bad status
// values are dropped.
export const extractReport = async (
  rawPaste: string,
  features: ProjectFeature[]
): Promise<{ report: ParsedReport; source: 'fence' | 'gemini' }> => {
  const knownIds = new Set(features.map((f) => f.id));
  const strict = extractFromFence(rawPaste, knownIds);
  if (strict && strict.features.length > 0) {
    return { report: strict, source: 'fence' };
  }
  const gemini = await extractWithGemini(rawPaste, features);
  return { report: gemini, source: 'gemini' };
};
