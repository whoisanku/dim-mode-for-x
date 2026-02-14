import { useEffect, useMemo, useState } from 'react'
import { getActiveTabId } from '@/platform/chrome/activeTab'
import type { XDimModeMessage, XDimModeMessageResponse } from '../model/messages'
import { getXDimModePrefs, setXDimModePrefs } from '../model/storage'

type ConnectionState = 'unknown' | 'connected' | 'not-connected'

function sendMessageToTab(tabId: number, message: XDimModeMessage): Promise<XDimModeMessageResponse> {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      const err = chrome.runtime.lastError
      if (err) return resolve({ ok: false, error: err.message ?? 'Unknown Chrome runtime error.' })
      resolve((response ?? { ok: false, error: 'No response from content script.' }) as XDimModeMessageResponse)
    })
  })
}

export default function XDimModePopup() {
  const [enabled, setEnabled] = useState<boolean>(true)
  const [loading, setLoading] = useState(true)
  const [connection, setConnection] = useState<ConnectionState>('unknown')

  const statusLabel = useMemo(() => {
    if (connection === 'connected') return 'Connected to X tab'
    if (connection === 'not-connected') return 'Open x.com or twitter.com to preview'
    return 'Checking active tab...'
  }, [connection])

  useEffect(() => {
    let cancelled = false

    async function init() {
      const prefs = await getXDimModePrefs()
      if (cancelled) return
      setEnabled(prefs.enabled)

      const tabId = await getActiveTabId()
      if (cancelled) return
      if (!tabId) {
        setConnection('not-connected')
        setLoading(false)
        return
      }

      const res = await sendMessageToTab(tabId, { type: 'X_DIM_MODE_GET_PREFS' })
      if (cancelled) return
      setConnection(res.ok ? 'connected' : 'not-connected')
      setLoading(false)
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  async function onToggle(nextEnabled: boolean) {
    setEnabled(nextEnabled)
    await setXDimModePrefs({ enabled: nextEnabled })

    const tabId = await getActiveTabId()
    if (!tabId) {
      setConnection('not-connected')
      return
    }

    const res = await sendMessageToTab(tabId, { type: 'X_DIM_MODE_SET_ENABLED', enabled: nextEnabled })
    setConnection(res.ok ? 'connected' : 'not-connected')
  }

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-50">
      <div className="p-4">
        <header className="flex items-baseline justify-between gap-3">
          <h1 className="text-lg font-semibold tracking-tight">Dim Mode for X</h1>
          <span className="text-xs text-zinc-400">v1</span>
        </header>

        <p className="mt-2 text-sm leading-6 text-zinc-300">
          Restores the classic Dim theme by replacing pure-black backgrounds used by X dark mode.
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-3">
          <div>
            <div className="text-sm font-medium text-zinc-100">Enable</div>
            <div className="text-xs text-zinc-400">{statusLabel}</div>
          </div>

          <button
            type="button"
            disabled={loading}
            aria-pressed={enabled}
            onClick={() => onToggle(!enabled)}
            className={[
              'relative h-7 w-12 rounded-full transition-colors',
              loading ? 'opacity-60' : 'opacity-100',
              enabled ? 'bg-sky-500' : 'bg-zinc-700',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300',
            ].join(' ')}
          >
            <span
              className={[
                'absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform',
                enabled ? 'translate-x-5' : 'translate-x-0',
              ].join(' ')}
            />
          </button>
        </div>

        <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-xs leading-5 text-zinc-400">
          Tip: in X settings, set Appearance to Dark mode for the dim theme to take effect.
        </div>
      </div>
    </div>
  )
}
