import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { enableHaptics } from './haptics'

enableHaptics()

// Opened from the iPhone home screen, the page can come up one status bar short of the screen,
// leaving a dark strip at the bottom. In that mode the app should always be exactly the screen's
// height, so we measure the screen itself instead of trusting 100%.
if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
  const fit = () => document.documentElement.style.setProperty('--app-h', `${window.screen.height}px`)
  fit()
  window.addEventListener('orientationchange', fit)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
