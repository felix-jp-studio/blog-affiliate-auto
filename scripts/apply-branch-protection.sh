#!/usr/bin/env bash
# main ブランチに保護ルールを適用する（要: admin 権限、CI チェック登録済み）
set -euo pipefail

REPO="${1:-felix-jp-studio/blog-affiliate-auto}"
BRANCH="${2:-main}"
CHECK_CONTEXT="CI / validate"

echo "Applying branch protection to ${REPO}@${BRANCH}"
echo "Required check: ${CHECK_CONTEXT}"

gh api "repos/${REPO}/branches/${BRANCH}/protection" -X PUT \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "checks": [
      {
        "context": "${CHECK_CONTEXT}",
        "app_id": 15368
      }
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": false
}
EOF

echo "Done."
