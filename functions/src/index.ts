import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { extractReport } from './extractReport';
import { buildGapPrompt } from './gapPrompt';
import { GEMINI_KEY } from './gemini';
import type {
  FeatureStatus,
  ParsedReport,
  ProjectDoc,
  ProjectFeature,
} from './types';

admin.initializeApp();
const db = admin.firestore();

// Maximum paste size we'll accept (~50 KB — generous for a Lovable response).
const MAX_PASTE_BYTES = 50_000;

const computeCompletionPct = (features: ProjectFeature[]): number => {
  if (!features.length) return 0;
  const score = features.reduce((sum, f) => {
    if (f.status === 'built') return sum + 1;
    if (f.status === 'partial') return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((score / features.length) * 100);
};

const mergeFeatureStatuses = (
  features: ProjectFeature[],
  parsed: ParsedReport,
  now: string
): ProjectFeature[] => {
  const byId = new Map(parsed.features.map((p) => [p.id, p]));
  return features.map((f) => {
    const update = byId.get(f.id);
    if (!update) return f;
    return {
      ...f,
      status: update.status as FeatureStatus,
      note: update.note,
      lastUpdatedFromReport: now,
    };
  });
};

export const parseBuildReport = onCall(
  {
    secrets: [GEMINI_KEY],
    cors: true,
    maxInstances: 20,
    region: 'us-central1',
  },
  async (request) => {
    // Auth
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required.');
    }
    const uid = request.auth.uid;

    // Input validation
    const { projectId, rawPaste, source } = (request.data ?? {}) as {
      projectId?: unknown;
      rawPaste?: unknown;
      source?: unknown;
    };
    if (typeof projectId !== 'string' || !projectId) {
      throw new HttpsError('invalid-argument', 'projectId is required.');
    }
    if (typeof rawPaste !== 'string' || !rawPaste.trim()) {
      throw new HttpsError('invalid-argument', 'rawPaste is required.');
    }
    if (Buffer.byteLength(rawPaste, 'utf8') > MAX_PASTE_BYTES) {
      throw new HttpsError(
        'invalid-argument',
        `Paste too large. Max ${MAX_PASTE_BYTES} bytes.`
      );
    }
    const reportSource: 'lovable' | 'cursor' | 'other' =
      source === 'lovable' || source === 'cursor' ? source : 'other';

    // Ownership
    const projectRef = db.collection('projects').doc(projectId);
    const projectSnap = await projectRef.get();
    if (!projectSnap.exists) {
      throw new HttpsError('not-found', 'Project not found.');
    }
    const project = projectSnap.data() as ProjectDoc;
    if (project.ownerId !== uid) {
      throw new HttpsError('permission-denied', 'Not your project.');
    }
    const features = Array.isArray(project.features) ? project.features : [];
    if (features.length === 0) {
      throw new HttpsError(
        'failed-precondition',
        'Project has no features to report against.'
      );
    }

    // Extract
    const { report, source: extractionSource } = await extractReport(
      rawPaste,
      features
    );
    logger.info('parseBuildReport extracted', {
      projectId,
      uid,
      extractionSource,
      featureCount: report.features.length,
    });

    // Apply + follow-up
    const now = new Date().toISOString();
    const updatedFeatures = mergeFeatureStatuses(features, report, now);
    const completionPct = computeCompletionPct(updatedFeatures);
    const suggestedNextPrompt = buildGapPrompt(project, report);

    // Write BuildReport doc + update project, atomically.
    const reportRef = projectRef.collection('buildReports').doc();
    const batch = db.batch();
    batch.set(reportRef, {
      id: reportRef.id,
      projectId,
      ownerId: uid,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      source: reportSource,
      extractionSource,
      rawPaste,
      parsedFeatures: report.features,
      blockers: report.blockers,
      filesChanged: report.filesChanged,
      suggestedNextPrompt: suggestedNextPrompt ?? null,
    });
    batch.update(projectRef, {
      features: updatedFeatures,
      completionPct,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await batch.commit();

    return {
      reportId: reportRef.id,
      extractionSource,
      completionPct,
      parsedFeatures: report.features,
      blockers: report.blockers,
      filesChanged: report.filesChanged,
      suggestedNextPrompt: suggestedNextPrompt ?? null,
    };
  }
);
