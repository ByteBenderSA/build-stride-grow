// Shape mirrored from src/lib/firestore.ts on the client. Kept narrow — only
// the fields the Cloud Function reads or writes. If the client type drifts,
// update both.

export type FeatureStatus =
  | 'pending'
  | 'built'
  | 'partial'
  | 'missing'
  | 'blocked';

export interface ProjectFeature {
  id: string;
  label: string;
  status: FeatureStatus;
  lastUpdatedFromReport?: string;
  note?: string;
}

export interface ProjectDoc {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  features: ProjectFeature[];
  completionPct?: number;
}

export interface ParsedReport {
  projectId?: string;
  features: Array<{ id: string; status: FeatureStatus; note?: string }>;
  blockers: string[];
  filesChanged: string[];
}
