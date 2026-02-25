#!/usr/bin/env bash
# Remove a git worktree.
# Usage: ./scripts/remove-worktree.sh <path-to-worktree>
# Example: ./scripts/remove-worktree.sh ../app-template--feature-auth
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <worktree-path>"
  echo "Example: $0 ../app-template--feature-auth"
  echo ""
  echo "List worktrees: git worktree list"
  exit 1
fi

git worktree remove "$1" || git worktree remove "$1" --force
