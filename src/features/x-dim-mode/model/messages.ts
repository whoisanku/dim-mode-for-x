import type { XDimModePrefs } from './prefs'

export type XDimModeMessage =
  | { type: 'X_DIM_MODE_GET_PREFS' }
  | { type: 'X_DIM_MODE_SET_ENABLED'; enabled: boolean }

export type XDimModeMessageResponse =
  | { ok: true; prefs: XDimModePrefs }
  | { ok: false; error: string }

