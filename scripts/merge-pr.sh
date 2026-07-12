#!/usr/bin/env bash
# オーナーが保護ブランチの PR をマージする（自己 Approve 不可のため --admin を使用）
set -euo pipefail

PR="${1:-}"
if [ -z "$PR" ]; then
  echo "Usage: $0 <pr-number>"
  exit 1
fi

BRANCH=$(gh pr view "$PR" --json headRefName --jq '.headRefName')
if [[ "$BRANCH" == rules/weekly-* ]]; then
  echo "週次 PR (${BRANCH}) は auto-merge-weekly-pr がマージします。手動マージは不要です。"
  exit 1
fi

echo "Merging PR #${PR} (${BRANCH}) with admin privileges..."
gh pr merge "$PR" --merge --admin --delete-branch
