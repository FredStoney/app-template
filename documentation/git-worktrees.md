# Git worktrees

This project is set up to use **git worktrees** so you can have multiple branches checked out at once in separate folders, without cloning the repo again.

## Why use worktrees

- **One `.git`** — All worktrees share the same repo metadata (single `git fetch` updates everything).
- **No stashing** — Work on a feature in one folder and a hotfix in another at the same time.
- **Less disk use** — No need for multiple full clones.
- **Clear separation** — e.g. `main` in the main folder, `feature/xyz` in a sibling worktree.

## Layout

- **Main worktree** (this directory): `app-template/` — use for `main` or your primary branch.
- **Extra worktrees**: sibling directories named `app-template--<branch>`, e.g.  
  `app-template--feature-auth`, `app-template--fix-login`.

Each worktree is a full working copy; run `npm install` in each new worktree after creating it.

## Quick reference

| Task | Command |
|------|--------|
| List worktrees | `git worktree list` |
| Create worktree (new branch) | `./scripts/new-worktree.sh feature/my-feature` |
| Create worktree (existing branch) | `./scripts/new-worktree.sh existing-branch --existing` |
| Remove worktree | `./scripts/remove-worktree.sh ../app-template--feature-my-feature` |
| Prune stale worktrees | `git worktree prune` |

## Manual commands

**Add worktree for a new branch** (branch created from current branch):

```bash
git worktree add ../app-template--feature-xyz -b feature/xyz
```

**Add worktree for an existing branch:**

```bash
git worktree add ../app-template--feature-xyz feature/xyz
```

**Remove a worktree** (from any worktree, after deleting or moving the folder if you want):

```bash
git worktree remove ../app-template--feature-xyz
# or to force: git worktree remove --force ../app-template--feature-xyz
```

**Prune** (clean up worktrees that no longer have a directory):

```bash
git worktree prune
```

## Rules

- A branch can only be checked out in **one** worktree at a time.
- Run `npm install` (or your package manager) in each new worktree after creating it.
- Prefer creating worktrees as **siblings** of the main repo (e.g. `../app-template--feature-name`) so paths stay simple.

## Scripts

- `scripts/new-worktree.sh` — Create a worktree; branch name becomes the directory suffix (e.g. `feature/auth` → `app-template--feature-auth`).
- `scripts/remove-worktree.sh` — Safely remove a worktree by path.

Run them from the **main** repo directory (`app-template`).
