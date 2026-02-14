# Dim Mode for X (Chrome Extension)

Restores the classic "Dim" theme on X (Twitter) by replacing the pure-black ("Lights out") backgrounds used by X dark mode with a deep navy background.

## Features

- Chrome Extension (Manifest V3)
- Popup UI (React + TypeScript + Tailwind v4)
- Content script that applies the dim theme on `x.com` and `twitter.com`
- Persisted toggle via `chrome.storage.sync`

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open Chrome and navigate to `chrome://extensions/`, enable "Developer mode", and load the unpacked extension from the `dist` directory.

4. On X, set Appearance to Dark mode (this extension then restores the Dim colors).

5. Build for production:

```bash
npm run build
```

## Project Structure

- `src/popup/` - Extension popup UI
- `src/content/` - Content scripts
- `src/features/` - Feature modules (recommended place for app logic/UI)
- `src/platform/` - Chrome API adapters
- `src/styles/` - Shared stylesheets (Tailwind entrypoint lives here)
- `manifest.config.ts` - Chrome extension manifest configuration

## Documentation

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [CRXJS Documentation](https://crxjs.dev/vite-plugin)

## Chrome Extension Development Notes

- Use `manifest.config.ts` to configure your extension
- The CRXJS plugin automatically handles manifest generation
- Content scripts should be placed in `src/content/`
- Popup UI should be placed in `src/popup/`
