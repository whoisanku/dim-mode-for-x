import { DEFAULT_X_DIM_MODE_PREFS, normalizeXDimModePrefs, type XDimModePrefs } from './prefs'

const STORAGE_AREA: chrome.storage.StorageArea = chrome.storage.local
const PREFS_KEY = 'x_dim_mode_prefs_v1' as const

type StorageShape = Record<typeof PREFS_KEY, XDimModePrefs | undefined>

function getFromStorage<T>(key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    STORAGE_AREA.get(key, (items) => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve((items as Record<string, T | undefined>)[key])
    })
  })
}

function setInStorage<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve, reject) => {
    STORAGE_AREA.set({ [key]: value }, () => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve()
    })
  })
}

export async function getXDimModePrefs(): Promise<XDimModePrefs> {
  try {
    const stored = await getFromStorage<StorageShape[typeof PREFS_KEY]>(PREFS_KEY)
    return { ...DEFAULT_X_DIM_MODE_PREFS, ...normalizeXDimModePrefs(stored) }
  }
  catch {
    return DEFAULT_X_DIM_MODE_PREFS
  }
}

export async function setXDimModePrefs(next: Partial<XDimModePrefs>): Promise<XDimModePrefs> {
  const prev = await getXDimModePrefs()
  const update: Partial<XDimModePrefs> = {}
  if (typeof next.enabled === 'boolean') update.enabled = next.enabled
  const merged: XDimModePrefs = { ...prev, ...update }
  await setInStorage(PREFS_KEY, merged)
  return merged
}

export function onXDimModePrefsChanged(listener: (prefs: XDimModePrefs) => void): () => void {
  const handler: Parameters<typeof chrome.storage.onChanged.addListener>[0] = (changes, areaName) => {
    if (areaName !== 'local') return
    const change = changes[PREFS_KEY]
    if (!change) return
    listener({ ...DEFAULT_X_DIM_MODE_PREFS, ...normalizeXDimModePrefs(change.newValue) })
  }

  chrome.storage.onChanged.addListener(handler)
  return () => chrome.storage.onChanged.removeListener(handler)
}
