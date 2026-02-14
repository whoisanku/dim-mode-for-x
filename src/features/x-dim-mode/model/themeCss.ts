import {
  X_DIM_BACKDROP,
  X_DIM_BG,
  X_DIM_BG_HOVER,
  X_DIM_BORDER,
  X_DIM_ELEVATED,
  X_DIM_TEXT,
} from './colors'

export function getXDimModeCss(rootClass: string): string {
  return `
html.${rootClass} {
  --xdm-bg: ${X_DIM_BG};
  --xdm-bg-hover: ${X_DIM_BG_HOVER};
  --xdm-bg-elevated: ${X_DIM_ELEVATED};
  --xdm-backdrop: ${X_DIM_BACKDROP};
  --xdm-text: ${X_DIM_TEXT};
  --xdm-border: ${X_DIM_BORDER};
}

/*
  X uses a pure black ("Lights out") background in dark mode.
  We restore the classic "Dim" theme by mapping those blacks to deep navy.
*/
html.${rootClass} body.LightsOut {
  --color: var(--xdm-bg) !important;
  --border: var(--xdm-bg) !important;
  --input: var(--xdm-bg) !important;
  --border-color: var(--xdm-border) !important;
  --compose-background: var(--xdm-bg) !important;
  --compose-close: var(--xdm-text) !important;
  --mask: var(--xdm-border) !important;
  --layer: var(--xdm-bg-elevated) !important;
  --portal: var(--xdm-bg-elevated) !important;
  --popover: var(--xdm-bg-elevated) !important;
}

html.${rootClass} body.LightsOut .xdm-dimmed {
  background-color: var(--xdm-bg) !important;
}

html.${rootClass} body.LightsOut .xdm-dimmed-elevated {
  background-color: var(--xdm-bg-elevated) !important;
}

html.${rootClass} body.LightsOut .r-kemksi,
html.${rootClass} body.LightsOut .r-1niwhzg,
html.${rootClass} body.LightsOut .r-yfoy6g,
html.${rootClass} body.LightsOut .r-14lw9ot,
html.${rootClass} body.LightsOut .r-5zmot {
  background-color: var(--xdm-bg) !important;
}

html.${rootClass} body.LightsOut [style*="background-color: rgb(0, 0, 0)"],
html.${rootClass} body.LightsOut [style*="background-color: rgb(0,0,0)"],
html.${rootClass} body.LightsOut [style*="background-color: rgb(0 0 0)"],
html.${rootClass} body.LightsOut [style*="background-color:#000"],
html.${rootClass} body.LightsOut [style*="background-color: #000"],
html.${rootClass} body.LightsOut [style*="background-color:#000000"],
html.${rootClass} body.LightsOut [style*="background-color: #000000"],
html.${rootClass} body.LightsOut [style*="background: rgb(0, 0, 0)"],
html.${rootClass} body.LightsOut [style*="background: rgb(0,0,0)"],
html.${rootClass} body.LightsOut [style*="background: rgb(0 0 0)"],
html.${rootClass} body.LightsOut [style*="background:#000"],
html.${rootClass} body.LightsOut [style*="background: #000"],
html.${rootClass} body.LightsOut [style*="background:#000000"],
html.${rootClass} body.LightsOut [style*="background: #000000"] {
  background-color: var(--xdm-bg) !important;
}

html.${rootClass} body.LightsOut [style*="background-color: rgba(0, 0, 0, 0.65)"],
html.${rootClass} body.LightsOut [style*="background-color: rgba(0,0,0,0.65)"],
html.${rootClass} body.LightsOut [style*="background-color: rgba(0 0 0 / 0.65)"] {
  background-color: var(--xdm-backdrop) !important;
}
`.trim()
}
