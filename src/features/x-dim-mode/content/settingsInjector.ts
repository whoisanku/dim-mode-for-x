import { setXDimModePrefs } from '../model/storage'
import type { XDimModePrefs } from '../model/prefs'
import { X_DIM_MODE_BUTTON_ID } from './constants'

const DIM_BG = 'rgb(21, 32, 43)'
const ACCENT = 'rgb(29, 155, 240)'
const TEXT = 'rgb(231, 233, 234)'

const CHECKMARK_SVG = `
<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
  <path fill="currentColor" d="M9.000 16.200 5.500 12.700 4.100 14.100 9.000 19.000 20.300 7.700 18.900 6.300z"></path>
</svg>
`.trim()

function setSelected(button: HTMLElement) {
  button.style.backgroundColor = DIM_BG
  button.style.border = `2px solid ${ACCENT}`
  button.style.outline = `2px solid ${ACCENT}`

  const inner = button.querySelector<HTMLElement>('div[dir="ltr"]')
  if (inner) inner.style.color = TEXT
}

function setUnselected(button: HTMLElement) {
  button.style.backgroundColor = DIM_BG
  button.style.border = '2px solid transparent'
  button.style.outline = 'none'

  const inner = button.querySelector<HTMLElement>('div[dir="ltr"]')
  if (inner) inner.style.color = ACCENT
}

function setLabel(button: HTMLElement, selected: boolean) {
  const inner = button.querySelector<HTMLElement>('div[dir="ltr"]')
  if (!inner) return
  inner.innerHTML = selected
    ? `${CHECKMARK_SVG}<div dir="ltr">Dim</div>`
    : `<div dir="ltr">Dim</div>`
}

function getBackgroundPickerGroup(): HTMLElement | null {
  const anyInput = document.querySelector<HTMLInputElement>('input[name="background-picker"]')
  if (!anyInput) return null
  return anyInput.closest<HTMLElement>('[role="radiogroup"]')
}

function getButtonForValue(group: HTMLElement, value: string): HTMLElement | null {
  const input = group.querySelector<HTMLInputElement>(`input[value="${value}"]`)
  if (!input) return null
  return input.closest<HTMLElement>('label')
}

function activateLightsOut(group: HTMLElement) {
  const lightsOutButton = getButtonForValue(group, 'LightsOut')
  const lightsOutInput = lightsOutButton?.querySelector<HTMLInputElement>('input')
  if (!lightsOutButton || !lightsOutInput) return
  if (lightsOutInput.checked) return

  lightsOutButton.click()
  lightsOutInput.dispatchEvent(new Event('input', { bubbles: true }))
  lightsOutInput.dispatchEvent(new Event('change', { bubbles: true }))
}

export function syncInjectedDimButton(prefs: XDimModePrefs) {
  const button = document.getElementById(X_DIM_MODE_BUTTON_ID)
  if (!(button instanceof HTMLElement)) return

  setLabel(button, prefs.enabled)
  if (prefs.enabled) setSelected(button)
  else setUnselected(button)
}

export function tryInjectDimModeIntoXSettings(prefs: XDimModePrefs) {
  if (document.getElementById(X_DIM_MODE_BUTTON_ID)) {
    syncInjectedDimButton(prefs)
    return
  }

  const group = getBackgroundPickerGroup()
  if (!group) return

  const defaultButton = getButtonForValue(group, 'Default')
  const lightsOutButton = getButtonForValue(group, 'LightsOut')
  if (!defaultButton || !lightsOutButton) return

  const dimButton = lightsOutButton.cloneNode(true) as HTMLElement
  dimButton.id = X_DIM_MODE_BUTTON_ID
  dimButton.dataset.xDimMode = 'true'

  // Avoid interfering with X's own radio group handling.
  const dimInput = dimButton.querySelector<HTMLInputElement>('input')
  if (dimInput) {
    dimInput.name = 'x-dim-mode'
    dimInput.value = 'Dim'
    dimInput.checked = false
  }

  setLabel(dimButton, prefs.enabled)
  if (prefs.enabled) setSelected(dimButton)
  else setUnselected(dimButton)

  dimButton.addEventListener('click', () => {
    void setXDimModePrefs({ enabled: true })
    syncInjectedDimButton({ ...prefs, enabled: true })
    activateLightsOut(group)
  })

  defaultButton.addEventListener('click', () => {
    void setXDimModePrefs({ enabled: false })
    syncInjectedDimButton({ ...prefs, enabled: false })
  })

  lightsOutButton.addEventListener('click', () => {
    void setXDimModePrefs({ enabled: false })
    syncInjectedDimButton({ ...prefs, enabled: false })
  })

  defaultButton.after(dimButton)
}
