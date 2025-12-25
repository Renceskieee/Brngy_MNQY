import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PersonalisationProvider } from './contexts/PersonalisationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersonalisationProvider>
      <App />
    </PersonalisationProvider>
  </StrictMode>,
)
