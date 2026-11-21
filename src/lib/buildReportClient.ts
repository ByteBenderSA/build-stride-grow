import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import type { FeatureStatus } from './firestore';

export interface ParseBuildReportRequest {
  projectId: string;
  rawPaste: string;
  source?: 'lovable' | 'cursor' | 'other';
}

export interface ParseBuildReportResponse {
  reportId: string;
  extractionSource: 'fence' | 'gemini';
  completionPct: number;
  parsedFeatures: Array<{ id: string; status: FeatureStatus; note?: string }>;
  blockers: string[];
  filesChanged: string[];
  suggestedNextPrompt: string | null;
}

// Thin typed wrapper around the parseBuildReport Cloud Function. The function
// does ownership + size checks and writes BuildReport + updated project in one
// batch, so this call is the full flow — no follow-up Firestore write needed.
export const parseBuildReport = async (
  req: ParseBuildReportRequest
): Promise<ParseBuildReportResponse> => {
  const callable = httpsCallable<ParseBuildReportRequest, ParseBuildReportResponse>(
    functions,
    'parseBuildReport'
  );
  const result = await callable(req);
  return result.data;
};
