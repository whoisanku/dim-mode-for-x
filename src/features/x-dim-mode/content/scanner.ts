import {
  X_DIM_MODE_DIMMED_CLASS,
  X_DIM_MODE_DIMMED_ELEVATED_CLASS,
} from './constants'
import { X_LIGHTS_OUT_ELEVATED_BG } from '../model/colors'

const COLOR_BLACK = new Set(['rgb(0,0,0)', 'rgb(0,0,0,1)', 'rgba(0,0,0,1)', '#000', '#000000'])
const COLOR_BACKDROP = new Set(['rgba(0,0,0,0.65)', 'rgb(0,0,0,0.65)', 'rgba(0 0 0 / 0.65)'])
const COLOR_ELEVATED = new Set([normalizeColor(X_LIGHTS_OUT_ELEVATED_BG)])

function normalizeColor(value: string): string {
  return value.trim().toLowerCase().replace(/ /g, '')
}

function markDimmed(el: Element, elevated: boolean) {
  el.classList.toggle(X_DIM_MODE_DIMMED_CLASS, !elevated)
  el.classList.toggle(X_DIM_MODE_DIMMED_ELEVATED_CLASS, elevated)
}

function unmarkDimmed(el: Element) {
  el.classList.remove(X_DIM_MODE_DIMMED_CLASS, X_DIM_MODE_DIMMED_ELEVATED_CLASS)
}

export function createXDimModeScanner() {
  const touched = new Set<Element>()
  let scanTimeout: number | null = null

  function scanElement(el: Element) {
    // Detect inline styles that force "Lights out" black, and tag them for CSS to rewrite.
    const inlineBg = el instanceof HTMLElement ? normalizeColor(el.style.backgroundColor) : ''
    if (inlineBg) {
      if (COLOR_BLACK.has(inlineBg) || COLOR_BACKDROP.has(inlineBg)) {
        markDimmed(el, false)
        touched.add(el)
        return
      }

      if (COLOR_ELEVATED.has(inlineBg)) {
        markDimmed(el, true)
        touched.add(el)
        return
      }
    }

    // Some X surfaces (e.g. Creator Studio) use computed styles rather than inline styles.
    if (el instanceof HTMLElement && el.hasAttribute('jf-element')) {
      const computed = normalizeColor(getComputedStyle(el).backgroundColor)
      if (COLOR_BLACK.has(computed) || COLOR_BACKDROP.has(computed)) {
        markDimmed(el, false)
        touched.add(el)
        return
      }

      if (COLOR_ELEVATED.has(computed)) {
        markDimmed(el, true)
        touched.add(el)
      }
    }
  }

  function scheduleFullScan() {
    if (scanTimeout !== null) return
    scanTimeout = window.setTimeout(() => {
      document.querySelectorAll('*').forEach(scanElement)
      scanTimeout = null
    }, 500)
  }

  function cancelScheduledScan() {
    if (scanTimeout === null) return
    window.clearTimeout(scanTimeout)
    scanTimeout = null
  }

  function clearAllMarks() {
    cancelScheduledScan()
    touched.forEach(unmarkDimmed)
    touched.clear()
  }

  return {
    scanElement,
    scheduleFullScan,
    cancelScheduledScan,
    clearAllMarks,
  }
}
