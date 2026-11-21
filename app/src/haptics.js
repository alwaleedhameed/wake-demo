// Light haptic tap on every button press, so the app feels physical in someone's hand.
// Android: the standard vibrate call. iPhone: Safari has no vibrate call, but since iOS 18 it
// plays a light haptic when a switch-style checkbox is toggled, so a hidden one is toggled on
// each press (the same trick as the open-source ios-haptics package). Elsewhere nothing happens.
let label = null

export function haptic() {
  try {
    if (typeof navigator.vibrate === 'function') { navigator.vibrate(8); return }
    if (!label) {
      label = document.createElement('label')
      label.setAttribute('aria-hidden', 'true')
      label.style.display = 'none'
      const input = document.createElement('input')
      input.type = 'checkbox'
      input.setAttribute('switch', '')
      label.appendChild(input)
      document.body.appendChild(label)
    }
    label.click()
  } catch { /* haptics are a nice-to-have; never break a tap over them */ }
}

// One listener for the whole app: any button, link-button or tap on a video card.
export function enableHaptics() {
  document.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.closest('button, a.btn, .card-ui')) haptic()
  }, true)
}
