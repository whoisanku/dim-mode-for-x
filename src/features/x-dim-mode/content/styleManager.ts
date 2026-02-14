import { getXDimModeCss } from '../model/themeCss'
import { X_DIM_MODE_ROOT_CLASS, X_DIM_MODE_STYLE_ID } from './constants'

const BASE_CSS = getXDimModeCss(X_DIM_MODE_ROOT_CLASS)

function getRoot(): HTMLElement {
  return document.documentElement
}

export function ensureXDimModeStyle() {
  const css = BASE_CSS
  const existing = document.getElementById(X_DIM_MODE_STYLE_ID)
  if (existing && existing instanceof HTMLStyleElement) {
    if (existing.textContent !== css) existing.textContent = css
    return existing
  }

  const style = document.createElement('style')
  style.id = X_DIM_MODE_STYLE_ID
  style.textContent = css
  ;(document.head ?? document.documentElement).appendChild(style)
  return style
}

export function setXDimModeRootActive(active: boolean) {
  getRoot().classList.toggle(X_DIM_MODE_ROOT_CLASS, active)
}

export function isXDimModeRootActive(): boolean {
  return getRoot().classList.contains(X_DIM_MODE_ROOT_CLASS)
}
