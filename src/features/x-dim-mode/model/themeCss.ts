const DIM_RGB = '21, 32, 43'
const DIM_BG = `rgb(${DIM_RGB})`
const DIM_BG_HOVER = 'rgb(30, 41, 54)'
const DIM_ELEVATED = 'rgb(24, 24, 27)'
const DIM_BACKDROP = 'rgba(0, 0, 0, 0.65)'
const DIM_TEXT = 'rgb(231, 233, 234)'
const DIM_BORDER = 'rgba(255, 255, 255, 0.2)'

export function getXDimModeCss(rootClass: string): string {
  return `
html.${rootClass} {
  --xdm-bg: ${DIM_BG};
  --xdm-bg-hover: ${DIM_BG_HOVER};
  --xdm-bg-elevated: ${DIM_ELEVATED};
  --xdm-backdrop: ${DIM_BACKDROP};
  --xdm-text: ${DIM_TEXT};
  --xdm-border: ${DIM_BORDER};
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
