import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Scoped hidden state for scroll reveals; see styles/index.css.
document.documentElement.classList.add('reveal-ready')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
