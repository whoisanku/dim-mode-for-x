import {
  X_DIM_BACKDROP,
  X_DIM_BG,
  X_DIM_BG_HOVER,
  X_DIM_BORDER,
  X_DIM_TEXT,
  X_DIM_BG_ELEVATED,
  X_LIGHTS_OUT_ELEVATED_BG,
} from './colors'

export function getXDimModeCss(rootClass: string): string {
  return `
/* Dim theme variables */
html.${rootClass} {
  --xdm-bg: ${X_DIM_BG};
  --xdm-bg-hover: ${X_DIM_BG_HOVER};
  --xdm-bg-elevated: ${X_DIM_BG_ELEVATED};
  --xdm-backdrop: ${X_DIM_BACKDROP};
  --xdm-text: ${X_DIM_TEXT};
  --xdm-border: ${X_DIM_BORDER};
}

/* Override X's own Lights Out theme variables */
html.${rootClass} body.LightsOut {
  --color: var(--xdm-text);
  --border: 206 16% 26%;
  --input: 206 16% 26%;
  --border-color: var(--xdm-border);
}

/* Chat / DM interface (Tailwind + shadcn/Radix) */
html.${rootClass}[data-theme="dark"],
html.${rootClass} [data-theme="dark"] {
  --background: 215 29% 13%;
  --border: 206 16% 26%;
  --input: 206 16% 26%;
  --muted-foreground: 206 16% 55%;
  --color-background: 215 29% 13%;
  --color-gray-0: 215 29% 13%;
  --color-gray-50: 206 16% 26%;
  --color-gray-100: 206 16% 26%;
  --color-gray-700: 206 16% 60%;
  --color-gray-800: 206 16% 50%;
}

/* ── Black background overrides ── */

/* Body — catches class-based black bg (e.g. Creator Studio) */
html.${rootClass} body {
  background-color: var(--xdm-bg) !important;
}

/* Inline styles (covers body, divs, modals, dropdowns, etc.) */
html.${rootClass} [style*="background-color: rgb(0, 0, 0)"],
html.${rootClass} [style*="background-color: rgba(0, 0, 0, 1)"] {
  background-color: var(--xdm-bg) !important;
}

/* Elevated section cards (Lights Out uses ${X_LIGHTS_OUT_ELEVATED_BG}) */
html.${rootClass} [style*="background-color: ${X_LIGHTS_OUT_ELEVATED_BG}"] {
  background-color: var(--xdm-bg-hover) !important;
}

/* Icon containers in menu rows (Premium, etc.) */
html.${rootClass} [role="link"] > div > div:first-child div:has(> svg:only-child) {
  background-color: var(--xdm-bg-elevated) !important;
}

/* X utility classes for black backgrounds */
html.${rootClass} .r-kemksi,
html.${rootClass} .r-1niwhzg,
html.${rootClass} .r-yfoy6g,
html.${rootClass} .r-14lw9ot {
  background-color: var(--xdm-bg) !important;
}

/* Action-button hover circles — make transparent so they match any parent bg */
html.${rootClass} .r-1niwhzg.r-sdzlij {
  background-color: transparent !important;
}

/* Timeline top bar */
html.${rootClass} .r-5zmot {
  background-color: var(--xdm-backdrop) !important;
}

/* Tweet character counter separator */
html.${rootClass} .r-1shrkeu {
  background-color: var(--xdm-border) !important;
}

/* Sidebar button hover */
html.${rootClass} .r-1hdo0pc {
  background-color: var(--xdm-bg-hover) !important;
}

/* Secondary background (section cards on Premium, etc.) */
html.${rootClass} .r-g2wdr4 {
  background-color: var(--xdm-bg-hover) !important;
}
html.${rootClass} .r-g2wdr4 [role="link"]:hover {
  background-color: var(--xdm-bg-elevated) !important;
}

/* Borders */
html.${rootClass} .r-1kqtdi0,
html.${rootClass} .r-1roi411 {
  border-color: var(--xdm-border) !important;
}
html.${rootClass} .r-2sztyj {
  border-top-color: var(--xdm-border) !important;
}
html.${rootClass} .r-1igl3o0,
html.${rootClass} .r-rull8r {
  border-bottom-color: var(--xdm-border) !important;
}

/* Separators / dividers */
html.${rootClass} .r-gu4em3,
html.${rootClass} .r-1bnu78o {
  background-color: var(--xdm-border) !important;
}

/* Search bar icon, tweet character counter */
html.${rootClass} .r-1bwzh9t {
  color: var(--xdm-text) !important;
}

/* "What's happening" text */
html.${rootClass} .draftjs-styles_0 .public-DraftEditorPlaceholder-root,
html.${rootClass} .public-DraftEditorPlaceholder-inner {
  color: var(--xdm-text) !important;
}

/* Secondary text */
html.${rootClass} [style*="color: rgb(113, 118, 123)"],
html.${rootClass} [style*="-webkit-line-clamp: 3; color: rgb(113, 118, 123)"],
html.${rootClass} [style*="-webkit-line-clamp: 2; color: rgb(113, 118, 123)"] {
  color: var(--xdm-text) !important;
}

/* Placeholders */
html.${rootClass} ::placeholder {
  color: var(--xdm-text) !important;
}

/* Tailwind classes used in chat/DM interface */
html.${rootClass} .bg-gray-0 {
  background-color: var(--xdm-bg) !important;
}
html.${rootClass} .border-gray-50,
html.${rootClass} .border-gray-100 {
  border-color: var(--xdm-border) !important;
}

/* Grok buttons (active) */
html.${rootClass} [style*="border-color: rgb(47, 51, 54)"].r-1che71a {
  background-color: var(--xdm-bg-hover) !important;
}

/* Scanner-discovered black backgrounds */
html.${rootClass} .xdm-dimmed {
  background-color: var(--xdm-bg) !important;
}

/* Scanner-discovered elevated backgrounds (e.g. section cards) */
html.${rootClass} .xdm-dimmed-elevated {
  background-color: var(--xdm-bg-hover) !important;
}

/* Creator Studio icon containers (jf-element framework) */
html.${rootClass} .jf-element:has(> span:only-child > svg:only-child) {
  background-color: var(--xdm-bg-elevated) !important;
}

/* Creator Studio dividers inside elevated section cards */
html.${rootClass} .xdm-dimmed-elevated .jf-element:empty {
  background-color: var(--xdm-border) !important;
  border-color: var(--xdm-border) !important;
}

/* Scrollbar */
html.${rootClass} {
  scrollbar-color: var(--xdm-border) var(--xdm-bg);
}
`.trim()
}
