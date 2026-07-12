import { copyFile } from "node:fs/promises";
import path from "node:path";
import { RULE_PAIRS, ensureArchiveDir } from "./lib/ruleReview.js";

/**
 * ルール更新前に current → previous へ退避（2世代のみ保持）。
 */
async function main(): Promise<void> {
  const root = process.cwd();
  await ensureArchiveDir(root);

  for (const [current, previous] of RULE_PAIRS) {
    const from = path.join(root, current);
    const to = path.join(root, previous);
    await copyFile(from, to);
    console.log(`rotated: ${current} -> ${previous}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
