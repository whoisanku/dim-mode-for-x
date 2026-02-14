# Architecture (SOLID-Friendly)

This project is structured to keep extension entrypoints thin and push logic into feature modules.

## Folders

- `src/popup/`: popup entry (composition root for popup)
- `src/content/`: content script entry
- `src/features/`: feature modules (UI + state + logic for a single capability)
- `src/platform/`: adapters for Chrome APIs (keeps feature code testable)
- `src/styles/`: shared stylesheets (Tailwind entrypoint)

## Dependency Rules (recommended)

- Entry folders (`popup/`, `content/`) may import anything.
- `features/` may import other `features/` only if it is a true dependency, but prefer sharing via `shared/` (when we add it).
- Feature/business logic should not call `chrome.*` directly. Wrap Chrome APIs behind thin adapters (via `src/platform/`).
