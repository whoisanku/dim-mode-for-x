export type XDimModePrefs = {
  enabled: boolean
}

export const DEFAULT_X_DIM_MODE_PREFS: XDimModePrefs = {
  enabled: true,
}

export function normalizeXDimModePrefs(input: unknown): XDimModePrefs {
  const candidate = input as Partial<XDimModePrefs> | null | undefined
  return {
    enabled: typeof candidate?.enabled === 'boolean' ? candidate.enabled : DEFAULT_X_DIM_MODE_PREFS.enabled,
  }
}

