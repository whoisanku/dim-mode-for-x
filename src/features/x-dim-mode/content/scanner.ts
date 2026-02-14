import {
  X_DIM_MODE_DIMMED_CLASS,
  X_DIM_MODE_DIMMED_ELEVATED_CLASS,
} from './constants'
import { X_LIGHTS_OUT_ELEVATED_BG } from '../model/colors'

const TAGS_TO_SCAN = 'div,main,aside,header,nav,section,article,footer,button'

const COLOR_BLACK = new Set(['rgb(0,0,0)', 'rgba(0,0,0,1)'])
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
  let scanFrame = 0
  const pending = new Set<Element>()

  function scanElement(el: Element) {
    if (el.classList.contains(X_DIM_MODE_DIMMED_CLASS) || el.classList.contains(X_DIM_MODE_DIMMED_ELEVATED_CLASS)) return

    // Inline black backgrounds are the common case.
    const inlineBg = el instanceof HTMLElement ? normalizeColor(el.style.backgroundColor) : ''
    if (inlineBg) {
      if (COLOR_BLACK.has(inlineBg)) {
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

    // Some X surfaces (e.g. Creator Studio) use computed styles.
    if (el instanceof HTMLElement && el.classList.contains('jf-element')) {
      let computed = ''
      try {
        computed = normalizeColor(getComputedStyle(el).backgroundColor)
      }
      catch {
        return
      }

      if (COLOR_BLACK.has(computed)) {
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

  function scanSubtree(root: Element) {
    scanElement(root)
    for (const el of root.querySelectorAll(TAGS_TO_SCAN)) scanElement(el)
  }

  function flushScan() {
    scanFrame = 0
    const batch = Array.from(pending)
    pending.clear()
    for (const node of batch) scanSubtree(node)
  }

  function queueScan(nodes: Iterable<Node>) {
    for (const n of nodes) {
      if (n && n.nodeType === Node.ELEMENT_NODE) pending.add(n as Element)
    }

    if (pending.size && !scanFrame) {
      scanFrame = requestAnimationFrame(flushScan)
    }
  }

  function fullRescan() {
    if (document.body) queueScan([document.body])
  }

  function clearAllMarks() {
    if (scanFrame) cancelAnimationFrame(scanFrame)
    scanFrame = 0
    pending.clear()
    touched.forEach(unmarkDimmed)
    touched.clear()
  }

  return {
    queueScan,
    fullRescan,
    clearAllMarks,
  }
}

