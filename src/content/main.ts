import type { XDimModeMessage, XDimModeMessageResponse } from '@/features/x-dim-mode/model/messages'
import { getXDimModePrefs, onXDimModePrefsChanged, setXDimModePrefs } from '@/features/x-dim-mode/model/storage'
import { getXDimModeCss } from '@/features/x-dim-mode/model/themeCss'

const STYLE_ID = 'x-dim-mode-style'

function ensureStyleElement(): HTMLStyleElement {
  const existing = document.getElementById(STYLE_ID)
  if (existing && existing instanceof HTMLStyleElement) return existing

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = getXDimModeCss()
  ;(document.head ?? document.documentElement).appendChild(style)
  return style
}

function removeStyleElement() {
  document.getElementById(STYLE_ID)?.remove()
}

function applyEnabled(enabled: boolean) {
  if (enabled) {
    ensureStyleElement()
    document.documentElement.dataset.xDimMode = 'on'
    return
  }

  removeStyleElement()
  delete document.documentElement.dataset.xDimMode
}

async function syncFromStorage() {
  const prefs = await getXDimModePrefs()
  applyEnabled(prefs.enabled)
}

void syncFromStorage()
onXDimModePrefsChanged((prefs) => applyEnabled(prefs.enabled))

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
        const prefs = await getXDimModePrefs()
        await respond({ ok: true, prefs })
        return
      }

      if (msg.type === 'X_DIM_MODE_SET_ENABLED') {
        const enabled = msg.enabled === true
        const prefs = await setXDimModePrefs({ enabled })
        applyEnabled(prefs.enabled)
        await respond({ ok: true, prefs })
      }
    }
    catch (err) {
      await respond({ ok: false, error: err instanceof Error ? err.message : String(err) })
    }
  })()

  return true
})
