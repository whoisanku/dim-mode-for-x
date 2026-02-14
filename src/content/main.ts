import type { XDimModeMessage, XDimModeMessageResponse } from '@/features/x-dim-mode/model/messages'
import { DEFAULT_X_DIM_MODE_PREFS, type XDimModePrefs } from '@/features/x-dim-mode/model/prefs'
import { getXDimModePrefs, onXDimModePrefsChanged, setXDimModePrefs } from '@/features/x-dim-mode/model/storage'
import { createXDimModeScanner } from '@/features/x-dim-mode/content/scanner'
import { tryInjectDimModeIntoXSettings, syncInjectedDimButton } from '@/features/x-dim-mode/content/settingsInjector'
import { ensureXDimModeStyle, setXDimModeRootActive } from '@/features/x-dim-mode/content/styleManager'

function isLightsOutThemeActive(): boolean {
  return document.body?.classList.contains('LightsOut') ?? false
}

const scanner = createXDimModeScanner()
let prefs: XDimModePrefs = DEFAULT_X_DIM_MODE_PREFS
let dimApplied = false
let rescanTimers: number[] = []

function clearRescanTimers() {
  for (const t of rescanTimers) window.clearTimeout(t)
  rescanTimers = []
}

function syncRuntime() {
  ensureXDimModeStyle()
  const shouldApplyDim = prefs.enabled && isLightsOutThemeActive()
  setXDimModeRootActive(shouldApplyDim)

  // Only scan/patch when X is in "Lights out" mode, otherwise we do nothing.
  if (!shouldApplyDim) {
    dimApplied = false
    clearRescanTimers()
    scanner.clearAllMarks()
  }
  else if (!dimApplied) {
    dimApplied = true
    scanner.fullRescan()
    clearRescanTimers()
    for (const ms of [500, 1500, 3000, 5000]) {
      rescanTimers.push(window.setTimeout(() => scanner.fullRescan(), ms))
    }
  }

  tryInjectDimModeIntoXSettings(prefs)
  syncInjectedDimButton(prefs)
}

// Keep the feature mounted early to avoid flashes when switching themes.
syncRuntime()

void (async () => {
  prefs = await getXDimModePrefs()
  syncRuntime()
})()

onXDimModePrefsChanged((next) => {
  prefs = next
  syncRuntime()
})

const bodyObserver = new MutationObserver(() => {
  // Theme changes are reflected via class mutations on <body>.
  syncRuntime()
})

const rootObserver = new MutationObserver((mutations) => {
  // X is a SPA; settings UI is mounted/unmounted without full page loads.
  // Keep trying to inject the Dim option as the Display settings DOM appears.
  tryInjectDimModeIntoXSettings(prefs)
  syncInjectedDimButton(prefs)

  if (!dimApplied) return
  for (const m of mutations) {
    if (m.addedNodes.length) scanner.queueScan(m.addedNodes)
  }
})

rootObserver.observe(document.documentElement, { childList: true, subtree: true })

function startBodyObserver() {
  if (!document.body) return
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] })
}

startBodyObserver()

// If body isn't available yet, we start observing it once it appears.
const waitForBody = new MutationObserver(() => {
  if (!document.body) return
  startBodyObserver()
  waitForBody.disconnect()
})
waitForBody.observe(document.documentElement, { childList: true, subtree: true })

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  const msg = message as Partial<XDimModeMessage> | null | undefined
  if (!msg?.type) return

  if (msg.type !== 'X_DIM_MODE_GET_PREFS' && msg.type !== 'X_DIM_MODE_SET_ENABLED') return

  async function respond(response: XDimModeMessageResponse) {
    sendResponse(response)
  }

  void (async () => {
    try {
      if (msg.type === 'X_DIM_MODE_GET_PREFS') {
        const current = await getXDimModePrefs()
        await respond({ ok: true, prefs: current })
        return
      }

      if (msg.type === 'X_DIM_MODE_SET_ENABLED') {
        const enabled = msg.enabled === true
        const updated = await setXDimModePrefs({ enabled })
        prefs = updated
        syncRuntime()
        await respond({ ok: true, prefs: updated })
      }
    }
    catch (err) {
      await respond({ ok: false, error: err instanceof Error ? err.message : String(err) })
    }
  })()

  return true
})
