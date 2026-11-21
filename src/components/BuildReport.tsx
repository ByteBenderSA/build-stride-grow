import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  XCircle,
  AlertTriangle,
  Clock,
  Copy,
  Loader2,
  History,
  ClipboardPaste,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  subscribeToProjectBuildReports,
  type BuildReport as BuildReportDoc,
  type Project,
  type ProjectFeature,
  type FeatureStatus,
} from "@/lib/firestore";
import {
  parseBuildReport,
  type ParseBuildReportResponse,
} from "@/lib/buildReportClient";

interface BuildReportProps {
  project: Project;
}

const STATUS_META: Record<
  FeatureStatus,
  { label: string; icon: typeof CheckCircle2; className: string; badge: string }
> = {
  built: {
    label: "Built",
    icon: CheckCircle2,
    className: "text-green-600",
    badge: "bg-green-100 text-green-800 border-green-200",
  },
  partial: {
    label: "Partial",
    icon: Clock,
    className: "text-amber-600",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
  },
  missing: {
    label: "Missing",
    icon: XCircle,
    className: "text-red-600",
    badge: "bg-red-100 text-red-700 border-red-200",
  },
  blocked: {
    label: "Blocked",
    icon: AlertTriangle,
    className: "text-orange-600",
    badge: "bg-orange-100 text-orange-800 border-orange-200",
  },
  pending: {
    label: "Not reported",
    icon: Circle,
    className: "text-gray-400",
    badge: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

const copyText = async (text: string, toastTitle = "Copied to clipboard") => {
  try {
    await navigator.clipboard.writeText(text);
    toast({ title: toastTitle });
  } catch {
    toast({
      title: "Copy failed",
      description: "Select the text and copy manually.",
      variant: "destructive",
    });
  }
};

const FeatureDiffList = ({
  features,
  highlightIds,
}: {
  features: ProjectFeature[];
  highlightIds?: Set<string>;
}) => (
  <ul className="space-y-2">
    {features.map((f) => {
      const meta = STATUS_META[f.status] ?? STATUS_META.pending;
      const Icon = meta.icon;
      const highlighted = highlightIds?.has(f.id);
      return (
        <li
          key={f.id}
          className={`flex items-start gap-3 p-3 rounded-md border ${
            highlighted ? "border-purple-300 bg-purple-50/50" : "border-gray-100"
          }`}
        >
          <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${meta.className}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm text-gray-900">{f.label}</p>
              <Badge variant="outline" className={`shrink-0 text-xs ${meta.badge}`}>
                {meta.label}
              </Badge>
            </div>
            {f.note && (
              <p className="text-xs text-gray-600 mt-1">{f.note}</p>
            )}
          </div>
        </li>
      );
    })}
  </ul>
);

const ReportHistoryItem = ({ report }: { report: BuildReportDoc }) => {
  const [open, setOpen] = useState(false);
  const counts = useMemo(() => {
    const c = { built: 0, partial: 0, missing: 0, blocked: 0 };
    for (const f of report.parsedFeatures) {
      if (f.status in c) c[f.status as keyof typeof c]++;
    }
    return c;
  }, [report.parsedFeatures]);

  return (
    <div className="border rounded-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-sm text-gray-700">
            {new Date(report.submittedAt).toLocaleString()}
          </span>
          <Badge variant="outline" className="text-xs">
            {report.source}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-green-700">{counts.built} built</span>
          <span className="text-amber-700">{counts.partial} partial</span>
          <span className="text-red-700">{counts.missing} missing</span>
          {counts.blocked > 0 && (
            <span className="text-orange-700">{counts.blocked} blocked</span>
          )}
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-3 border-t pt-3">
          {report.blockers.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Blockers</p>
              <ul className="text-xs text-gray-600 list-disc ml-5 space-y-0.5">
                {report.blockers.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}
          {report.suggestedNextPrompt && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-gray-700">
                  Follow-up prompt
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyText(report.suggestedNextPrompt!)}
                  className="h-6 text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" /> Copy
                </Button>
              </div>
              <pre className="text-xs bg-gray-50 p-2 rounded max-h-40 overflow-auto whitespace-pre-wrap">
                {report.suggestedNextPrompt}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BuildReport = ({ project }: BuildReportProps) => {
  const [paste, setPaste] = useState("");
  const [source, setSource] = useState<"lovable" | "cursor">("lovable");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latest, setLatest] = useState<ParseBuildReportResponse | null>(null);
  const [history, setHistory] = useState<BuildReportDoc[]>([]);

  useEffect(() => {
    const unsub = subscribeToProjectBuildReports(project.id, setHistory);
    return unsub;
  }, [project.id]);

  const handleSubmit = async () => {
    const trimmed = paste.trim();
    if (!trimmed) {
      toast({
        title: "Nothing to analyze",
        description: "Paste your builder's response first.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await parseBuildReport({
        projectId: project.id,
        rawPaste: trimmed,
        source,
      });
      setLatest(result);
      setPaste("");
      toast({
        title: "Build report analyzed",
        description: `${result.completionPct}% complete — ${result.parsedFeatures.length} features graded.`,
      });
    } catch (error) {
      toast({
        title: "Couldn't analyze that paste",
        description:
          error instanceof Error ? error.message : "Try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // After a submission we want to highlight the features the report just
  // touched; without a latest we show the project's current baseline.
  const latestIds = useMemo(
    () => (latest ? new Set(latest.parsedFeatures.map((f) => f.id)) : undefined),
    [latest]
  );

  const completionPct = latest?.completionPct ?? project.completionPct ?? 0;

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardPaste className="w-5 h-5 text-emerald-600" />
              Build Report
            </CardTitle>
            <CardDescription className="mt-1">
              After Lovable or Cursor finishes a build, paste the full response
              here. We'll check it against your feature list and generate a
              follow-up prompt for anything missing.
            </CardDescription>
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-bold text-gray-900">{completionPct}%</div>
            <div className="text-xs text-gray-600">complete</div>
          </div>
        </div>
        <Progress value={completionPct} className="mt-3 h-2" />
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Paste input */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-700">Source:</span>
            <Button
              size="sm"
              variant={source === "lovable" ? "default" : "outline"}
              onClick={() => setSource("lovable")}
            >
              Lovable
            </Button>
            <Button
              size="sm"
              variant={source === "cursor" ? "default" : "outline"}
              onClick={() => setSource("cursor")}
            >
              Cursor
            </Button>
          </div>
          <Textarea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder={`Paste the complete response from ${source} here. We look for the companai-report-v1 JSON block first; if it's not there, AI extracts the status.`}
            rows={8}
            disabled={isSubmitting}
            className="font-mono text-xs"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {paste.length > 0 ? `${paste.length.toLocaleString()} characters` : " "}
            </p>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !paste.trim()}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze build"
              )}
            </Button>
          </div>
        </div>

        {/* Feature diff */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Feature status</h4>
            {latest && (
              <Badge variant="outline" className="text-xs">
                Source: {latest.extractionSource === "fence" ? "JSON fence" : "AI extracted"}
              </Badge>
            )}
          </div>
          <FeatureDiffList features={project.features} highlightIds={latestIds} />
        </div>

        {/* Follow-up prompt */}
        {latest?.suggestedNextPrompt && (
          <div className="border-2 border-purple-300 rounded-lg overflow-hidden">
            <div className="bg-purple-50 px-4 py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-purple-900">
                  Fix-the-gaps prompt
                </h4>
                <p className="text-xs text-purple-700">
                  Copy this into Lovable to finish what's missing.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => copyText(latest.suggestedNextPrompt!, "Follow-up prompt copied")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Copy className="w-4 h-4 mr-2" /> Copy prompt
              </Button>
            </div>
            <pre className="bg-gray-900 text-green-300 text-xs p-4 max-h-80 overflow-auto whitespace-pre-wrap">
              {latest.suggestedNextPrompt}
            </pre>
          </div>
        )}

        {/* Blockers from latest */}
        {latest && latest.blockers.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <h4 className="font-semibold text-amber-900 text-sm">
                Blockers from the last build
              </h4>
            </div>
            <ul className="text-sm text-amber-900 list-disc ml-5 space-y-1">
              {latest.blockers.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Previous reports</h4>
              <Badge variant="outline" className="text-xs">
                {history.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {history.map((r) => (
                <ReportHistoryItem key={r.id} report={r} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuildReport;
