import type { XDimModePrefs } from '../model/prefs'
import { setXDimModePrefs } from '../model/storage'
import { X_ACCENT, X_DIM_BG } from '../model/colors'
import { X_DIM_MODE_BUTTON_ID } from './constants'

const DIM_LABEL = 'Dim'

// Copied from X's own checkmark glyph (minimal).
const CHECKMARK_SVG = `
<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
  <path fill="currentColor" d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
</svg>
`.trim()

// These come from X's own Lights Out styling and keep the injected button consistent.
const UNSELECTED_BORDER = 'rgb(51, 54, 57)'
const UNSELECTED_CIRCLE_BORDER = 'rgb(185, 202, 211)'

let switchingToDim = false

function getRadioCircle(btnEl: HTMLElement): HTMLElement | null {
  return btnEl.querySelector<HTMLElement>('[role="radio"] > div')
}

function setSelected(btnEl: HTMLElement) {
  btnEl.style.borderColor = X_ACCENT
  btnEl.style.borderWidth = '2px'

  const circle = getRadioCircle(btnEl)
  if (circle) {
    circle.style.backgroundColor = X_ACCENT
    circle.style.borderColor = X_ACCENT
    circle.style.color = 'white'
    circle.innerHTML = CHECKMARK_SVG
  }

  const input = btnEl.querySelector<HTMLInputElement>('input[type="radio"]')
  if (input) input.checked = true
}

function setUnselected(btnEl: HTMLElement) {
  btnEl.style.borderColor = UNSELECTED_BORDER
  btnEl.style.borderWidth = '1px'

  const circle = getRadioCircle(btnEl)
  if (circle) {
    circle.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    circle.style.borderColor = UNSELECTED_CIRCLE_BORDER
    circle.innerHTML = ''
  }

  const input = btnEl.querySelector<HTMLInputElement>('input[type="radio"]')
  if (input) input.checked = false
}

function getBackgroundPickerRadioGroup(): HTMLElement | null {
  const anyRadio = document.querySelector<HTMLInputElement>('input[name="background-picker"]')
  if (!anyRadio) return null
  return anyRadio.closest<HTMLElement>('[role="radiogroup"]')
}

function getBackgroundButtons(radiogroup: HTMLElement): HTMLElement[] {
  const buttons = Array.from(radiogroup.querySelectorAll<HTMLElement>(':scope > div'))
  if (buttons.length >= 2) return buttons

  // Fallback for markup variants: find elements that contain the background-picker radios.
  const radios = Array.from(radiogroup.querySelectorAll<HTMLInputElement>('input[name="background-picker"][type="radio"]'))
  const unique = new Set<HTMLElement>()
  for (const radio of radios) {
    const btn = radio.closest<HTMLElement>('div')
    if (btn) unique.add(btn)
  }
  return Array.from(unique)
}

function syncSettingsButtons(enabled: boolean) {
  const dimBtn = document.getElementById(X_DIM_MODE_BUTTON_ID)
  if (!(dimBtn instanceof HTMLElement)) return
  const radiogroup = dimBtn.closest<HTMLElement>('[role="radiogroup"]')
  if (!radiogroup) return

  const allBtns = getBackgroundButtons(radiogroup)
  const lightsOutBtn = allBtns[allBtns.length - 1]

  if (enabled) {
    setSelected(dimBtn)
    for (const btn of allBtns) {
      if (btn !== dimBtn) setUnselected(btn)
    }
  }
  else {
    setUnselected(dimBtn)
    if (lightsOutBtn) setSelected(lightsOutBtn)
  }
}

function activateLightsOutFromSettings() {
  const dimBtn = document.getElementById(X_DIM_MODE_BUTTON_ID)
  if (!(dimBtn instanceof HTMLElement)) return
  const radiogroup = dimBtn.closest<HTMLElement>('[role="radiogroup"]')
  if (!radiogroup) return

  const allBtns = getBackgroundButtons(radiogroup)
  const lightsOutBtn = allBtns[allBtns.length - 1]
  if (!lightsOutBtn) return

  const loInput = lightsOutBtn.querySelector<HTMLInputElement>('input[type="radio"]')
  if (loInput && !loInput.checked) {
    switchingToDim = true
    loInput.click()
    loInput.dispatchEvent(new Event('input', { bubbles: true }))
    loInput.dispatchEvent(new Event('change', { bubbles: true }))
    window.setTimeout(() => {
      switchingToDim = false
    }, 300)
  }
}

export function syncInjectedDimButton(prefs: XDimModePrefs) {
  syncSettingsButtons(prefs.enabled)
}

export function tryInjectDimModeIntoXSettings(prefs: XDimModePrefs) {
  if (document.getElementById(X_DIM_MODE_BUTTON_ID)) {
    syncInjectedDimButton(prefs)
    return
  }

  const radiogroup = getBackgroundPickerRadioGroup()
  if (!radiogroup) return

  const buttons = getBackgroundButtons(radiogroup)
  if (buttons.length < 2) return

  const defaultBtn = buttons[0]
  const lightsOutBtn = buttons[buttons.length - 1]

  // Clone the Lights Out button as our base.
  const dimBtn = lightsOutBtn.cloneNode(true) as HTMLElement
  dimBtn.id = X_DIM_MODE_BUTTON_ID

  // Dim-specific visuals
  dimBtn.style.backgroundColor = X_DIM_BG

  // Change label to "Dim"
  const label = dimBtn.querySelector('span')
  if (label) label.textContent = DIM_LABEL

  // Update aria label (keeps it accessible even if value is still LightsOut)
  const input = dimBtn.querySelector<HTMLInputElement>('input[type="radio"]')
  if (input) {
    input.setAttribute('aria-label', DIM_LABEL)
    input.checked = false
  }

  // Insert between Default and Lights Out
  radiogroup.insertBefore(dimBtn, lightsOutBtn)

  // Initial visual state
  syncInjectedDimButton(prefs)

  // Click handlers
  dimBtn.addEventListener('click', () => {
    void setXDimModePrefs({ enabled: true })
    syncSettingsButtons(true)
    activateLightsOutFromSettings()
  })

  for (const nativeBtn of [defaultBtn, lightsOutBtn]) {
    nativeBtn.addEventListener('click', () => {
      if (switchingToDim) return
      void setXDimModePrefs({ enabled: false })
      setUnselected(dimBtn)
    })
  }
}
