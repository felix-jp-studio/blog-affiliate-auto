import { execSync } from "node:child_process";
import path from "node:path";
import {
  applyRuleDrafts,
  appendReviewLog,
  buildNextState,
  decideReview,
  formatLogEntry,
  readJsonFile,
  rollbackRules,
  rotateRuleArchives,
  writeJsonFile,
  type ReviewInput,
  type ReviewState,
  type RuleWeights,
} from "./lib/ruleReview.js";

type CliOptions = {
  dryRun: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  return { dryRun: argv.includes("--dry-run") };
}

function getGitSha(root: string): string | null {
  try {
    return execSync("git rev-parse --short HEAD", {
      cwd: root,
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const root = process.cwd();
  const { dryRun } = parseArgs(process.argv.slice(2));

  const inputPath = path.join(root, "config/rule-review-input.json");
  const statePath = path.join(root, "config/rule-review-state.json");
  const weightsPath = path.join(root, "config/rule-review-weights.json");

  const input = await readJsonFile<ReviewInput>(inputPath);
  const state = await readJsonFile<ReviewState>(statePath);
  const weights = await readJsonFile<RuleWeights>(weightsPath);

  const { decision, currentScore, previousScore, reason } = decideReview(
    state,
    input,
    weights,
  );

  console.log(`[rules:weekly-review] decision=${decision} reason=${reason}`);

  if (decision === "skip") {
    console.log("スキップ: 同一 weekId は再実行しません");
    return;
  }

  let appliedDrafts: string[] = [];

  if (!dryRun) {
    if (decision === "rollback") {
      await rollbackRules(root);
      console.log("rolled back: archive/*.previous.mdc -> .cursor/rules/*.mdc");
    } else if (decision === "update" || decision === "hold") {
      await rotateRuleArchives(root);
      console.log("rotated: current -> archive/*.previous.mdc");

      appliedDrafts = await applyRuleDrafts(root);
      if (appliedDrafts.length > 0) {
        for (const draft of appliedDrafts) {
          console.log(`applied draft: ${draft}`);
        }
      } else {
        await rollbackRules(root);
        console.log("ドラフトなし: ルール内容を維持（アーカイブのみ更新）");
      }
    }

    const nextState = buildNextState(
      state,
      input,
      decision,
      currentScore,
      getGitSha(root),
    );
    await writeJsonFile(statePath, nextState);

    const logEntry = formatLogEntry({
      weekId: input.weekId,
      decision,
      reason,
      currentScore,
      previousScore,
      appliedDrafts,
      dryRun: false,
    });
    await appendReviewLog(root, logEntry);
  } else {
    console.log(
      `[dry-run] would decision=${decision} score=${currentScore} prev=${previousScore ?? "n/a"}`,
    );
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
