# Cursor context

Cursor rules and commands for this project live in the repo under `.cursor/`.

## Rules (`.cursor/rules/`)

Rules shape how Cursor behaves when working in this project.

- **`.md`** – Plain markdown; applied when relevant or when you @-mention the file.
- **`.mdc`** – Markdown with YAML frontmatter:
  - `alwaysApply: true` – applied in every chat
  - `globs: ["path/**/*.ts"]` – applied when matching files are in context
  - `description: "..."` – helps Cursor decide when to attach the rule

Subfolders (e.g. `frontend/`, `api/`) are supported for organization.

**Current rules:** see [.cursor/rules/](../../.cursor/rules/) (e.g. `project-context.mdc` for project-wide conventions).

## Commands (`.cursor/commands/`)

Custom commands are Markdown files in `.cursor/commands/`. In Cursor chat, type **`/`** to list and run them.

- **Project commands** (in this repo): shared with the team.
- **Global commands**: `~/.cursor/commands/` on your machine for personal shortcuts.

Each `.md` file’s content is the prompt Cursor runs when you invoke that command.

**Current commands:** see [.cursor/commands/](../../.cursor/commands/) (e.g. `code-review.md`).
