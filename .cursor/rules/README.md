# Cursor rules

Rules in this folder shape how Cursor behaves in this project.

## Rules in this project

| Rule | When applied | Covers |
|------|--------------|--------|
| `project-context.mdc` | Always | General context, prefer editing existing code, minimal changes |
| `coding-standards.mdc` | Always | Naming, structure, DRY, error handling, formatting |
| `security.mdc` | Always | Secrets, input validation, injection, logging, dependencies |
| `test-driven-development.mdc` | Always | TDD workflow, run tests before/after changes, test-first |
| `testing.mdc` | Test files in context | Test structure, naming, mocks, assertions |
| `ui-playwright-check.mdc` | Svelte/TS/CSS files in `apps/app/src/` or `static/` | Check Playwright smoke suite for affected tests after any UI change |
| `documentation.mdc` | README/docs in context | Comments, public API docs, README, TODOs |
| `git-commits.mdc` | When relevant | Commit scope, message format, branch naming |
| `env-example.mdc` | Always | Keep `.env.example` in sync with env vars used in code |

## File types

- **`.md`** – Plain markdown; applied when relevant or when you @-mention the file.
- **`.mdc`** – Markdown with YAML frontmatter for control:

  - `alwaysApply: true` – applied in every chat.
  - `globs: ["src/**/*.tsx"]` – applied when matching files are in context.
  - `description: "..."` – helps Cursor decide when to attach the rule.

Subfolders are supported (e.g. `frontend/`, `api/`) for organization.
