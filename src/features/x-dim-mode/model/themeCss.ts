const DIM_RGB = '21, 32, 43'
const DIM = `rgb(${DIM_RGB})`
const DIM_65 = `rgba(${DIM_RGB}, 0.65)`

export function getXDimModeCss(): string {
  return `
:root {
  --x-dim-bg: ${DIM};
  --x-dim-bg-65: ${DIM_65};
}

/*
  X (Twitter) "Lights out" uses pure black backgrounds in many places.
  The classic "Dim" theme is essentially a deep navy background instead.
  We restore dim mode by rewriting those pure-black backgrounds.
*/
body,
.r-kemksi,
[style*="background-color: rgb(0, 0, 0)"],
[style*="background-color: rgb(0,0,0)"],
[style*="background-color: rgb(0 0 0)"],
[style*="background-color:#000"],
[style*="background-color: #000"],
[style*="background-color:#000000"],
[style*="background-color: #000000"],
[style*="background: rgb(0, 0, 0)"],
[style*="background: rgb(0,0,0)"],
[style*="background: rgb(0 0 0)"],
[style*="background:#000"],
[style*="background: #000"],
[style*="background:#000000"],
[style*="background: #000000"] {
  background-color: var(--x-dim-bg) !important;
}

[style*="background-color: rgba(0, 0, 0, 0.65)"],
[style*="background-color: rgba(0,0,0,0.65)"],
[style*="background-color: rgba(0 0 0 / 0.65)"] {
  background-color: var(--x-dim-bg-65) !important;
}
`.trim()
}

