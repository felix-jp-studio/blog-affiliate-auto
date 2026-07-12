import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/** Cursor が読む active ルールと 1 世代前の退避先 */
export const RULE_PAIRS: ReadonlyArray<readonly [string, string]> = [
  [
    ".cursor/rules/project-context.mdc",
    ".cursor/rules/archive/project-context.previous.mdc",
  ],
  [
    ".cursor/rules/agent-workflows.mdc",
    ".cursor/rules/archive/agent-workflows.previous.mdc",
  ],
  [
    ".cursor/rules/docs-editing.mdc",
    ".cursor/rules/archive/docs-editing.previous.mdc",
  ],
] as const;

export type RuleMetrics = {
  taskCompletionRate: number;
  docQualityScore: number;
  manualInterventionCount: number;
  pipelineProgress: number;
  agentFollowedRulesRate: number;
};

export type RuleWeights = Record<keyof RuleMetrics, number>;

export type PeriodRecord = {
  weekId: string;
  ruleSet: "current" | "previous";
  metrics: RuleMetrics;
  compositeScore: number;
};

export type ReviewState = {
  lastReviewWeek: string | null;
  lastDecision: "rollback" | "update" | "hold" | null;
  activeRuleVersionSha: string | null;
  periods: {
    current: PeriodRecord | null;
    previous: PeriodRecord | null;
  };
};

export type ReviewInput = {
  weekId: string;
  ruleSet: "current";
  metrics: RuleMetrics;
  notes?: string;
};

export type ReviewDecision = "rollback" | "update" | "hold" | "skip";

const METRIC_KEYS: Array<keyof RuleMetrics> = [
  "taskCompletionRate",
  "docQualityScore",
  "manualInterventionCount",
  "pipelineProgress",
  "agentFollowedRulesRate",
];

export function computeCompositeScore(
  metrics: RuleMetrics,
  weights: RuleWeights,
): number {
  const manualNorm = Math.max(
    0,
    1 - Math.min(metrics.manualInterventionCount, 10) / 10,
  );
  const docNorm = Math.max(0, Math.min(metrics.docQualityScore, 5)) / 5;
  const pipelineNorm = Math.max(0, Math.min(metrics.pipelineProgress, 10)) / 10;

  const parts: Record<keyof RuleMetrics, number> = {
    taskCompletionRate: clamp01(metrics.taskCompletionRate),
    docQualityScore: docNorm,
    manualInterventionCount: manualNorm,
    pipelineProgress: pipelineNorm,
    agentFollowedRulesRate: clamp01(metrics.agentFollowedRulesRate),
  };

  let totalWeight = 0;
  let score = 0;
  for (const key of METRIC_KEYS) {
    const w = weights[key] ?? 0;
    totalWeight += w;
    score += parts[key] * w;
  }

  if (totalWeight === 0) return 0;
  return Math.round((score / totalWeight) * 100);
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(value, 1));
}

/** previous のスコアが current より高い場合は巻き戻し */
export function decideReview(
  state: ReviewState,
  input: ReviewInput,
  weights: RuleWeights,
): {
  decision: ReviewDecision;
  currentScore: number;
  previousScore: number | null;
  reason: string;
} {
  const currentScore = computeCompositeScore(input.metrics, weights);
  const previousScore = state.periods.current?.compositeScore ?? null;

  if (state.lastReviewWeek === input.weekId) {
    return {
      decision: "skip",
      currentScore,
      previousScore,
      reason: `weekId ${input.weekId} は既にレビュー済み`,
    };
  }

  if (previousScore === null) {
    return {
      decision: "update",
      currentScore,
      previousScore: null,
      reason: "比較対象の前週スコアがないため、初回更新を実行",
    };
  }

  if (previousScore > currentScore) {
    return {
      decision: "rollback",
      currentScore,
      previousScore,
      reason: `前世代スコア ${previousScore} > 現行 ${currentScore} のため巻き戻し`,
    };
  }

  if (previousScore === currentScore) {
    return {
      decision: "hold",
      currentScore,
      previousScore,
      reason: `スコア同点（${currentScore}）。ドラフトがあれば更新、なければ維持`,
    };
  }

  return {
    decision: "update",
    currentScore,
    previousScore,
    reason: `現行スコア ${currentScore} >= 前世代 ${previousScore} のため更新継続`,
  };
}

export async function ensureArchiveDir(root: string): Promise<void> {
  await mkdir(path.join(root, ".cursor/rules/archive"), { recursive: true });
}

export async function rotateRuleArchives(root: string): Promise<void> {
  await ensureArchiveDir(root);
  for (const [current, previous] of RULE_PAIRS) {
    await copyFile(path.join(root, current), path.join(root, previous));
  }
}

export async function rollbackRules(root: string): Promise<void> {
  for (const [current, previous] of RULE_PAIRS) {
    await copyFile(path.join(root, previous), path.join(root, current));
  }
}

export async function applyRuleDrafts(root: string): Promise<string[]> {
  const draftsDir = path.join(root, "config/rule-drafts");
  const applied: string[] = [];

  for (const [current] of RULE_PAIRS) {
    const baseName = path.basename(current, ".mdc");
    const draftPath = path.join(draftsDir, `${baseName}.mdc`);
    try {
      await copyFile(draftPath, path.join(root, current));
      applied.push(draftPath);
    } catch {
      // ドラフトが無ければスキップ
    }
  }

  return applied;
}

export function buildNextState(
  state: ReviewState,
  input: ReviewInput,
  decision: ReviewDecision,
  currentScore: number,
  versionSha: string | null,
): ReviewState {
  const endedPeriod: PeriodRecord = {
    weekId: input.weekId,
    ruleSet: "current",
    metrics: input.metrics,
    compositeScore: currentScore,
  };

  return {
    lastReviewWeek: input.weekId,
    lastDecision:
      decision === "skip"
        ? state.lastDecision
        : (decision as ReviewState["lastDecision"]),
    activeRuleVersionSha: versionSha,
    periods: {
      previous: state.periods.current ?? state.periods.previous,
      current: endedPeriod,
    },
  };
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function writeJsonFile(
  filePath: string,
  data: unknown,
): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function formatLogEntry(params: {
  weekId: string;
  decision: ReviewDecision;
  reason: string;
  currentScore: number;
  previousScore: number | null;
  appliedDrafts: string[];
  dryRun: boolean;
}): string {
  const lines = [
    `## ${params.weekId} (${new Date().toISOString().slice(0, 10)})`,
    "",
    `- **判定**: ${params.decision}${params.dryRun ? " (dry-run)" : ""}`,
    `- **理由**: ${params.reason}`,
    `- **スコア**: 今週 ${params.currentScore}${params.previousScore !== null ? ` / 前週 ${params.previousScore}` : ""}`,
    `- **適用ドラフト**: ${params.appliedDrafts.length > 0 ? params.appliedDrafts.map((p) => path.basename(p)).join(", ") : "なし"}`,
    "",
  ];
  return lines.join("\n");
}

export async function appendReviewLog(
  root: string,
  entry: string,
): Promise<void> {
  const logPath = path.join(root, "docs/rule-review/log.md");
  let existing = "";
  try {
    existing = await readFile(logPath, "utf8");
  } catch {
    existing = "# ルール週次レビュー ログ\n\n";
  }
  await writeFile(logPath, `${existing}\n${entry}`, "utf8");
}
