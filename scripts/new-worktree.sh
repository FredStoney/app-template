#!/usr/bin/env bash
# Create a new git worktree for this repo.
# Usage:
#   ./scripts/new-worktree.sh feature/my-branch        # new branch from current
#   ./scripts/new-worktree.sh existing-branch --existing  # checkout existing branch
set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
REPO_NAME="$(basename "$REPO_ROOT")"
PARENT="$(dirname "$REPO_ROOT")"

if [ -z "$1" ]; then
  echo "Usage: $0 <branch-name> [--existing]"
  echo "  branch-name   e.g. feature/auth or fix/login"
  echo "  --existing    use existing branch (default: create new branch from current HEAD)"
  exit 1
fi

BRANCH="$1"
SANITIZED="${BRANCH//\//-}"
WORKTREE_PATH="${PARENT}/${REPO_NAME}--${SANITIZED}"

if [ -d "$WORKTREE_PATH" ]; then
  echo "Path already exists: $WORKTREE_PATH"
  exit 1
fi

cd "$REPO_ROOT"
if [ "${2:-}" = "--existing" ]; then
  git worktree add "$WORKTREE_PATH" "$BRANCH"
else
  git worktree add "$WORKTREE_PATH" -b "$BRANCH"
fi

echo "Created worktree at: $WORKTREE_PATH"
echo "Run 'npm install' (or your package manager) in that directory, then start working."
