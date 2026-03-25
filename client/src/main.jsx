import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// Initialize Tailwind dark-mode class from persisted preference (or OS default).
const savedDarkMode = localStorage.getItem('darkMode')
// Default must be light unless the user explicitly chose dark.
const shouldUseDark = savedDarkMode === 'true'
if (shouldUseDark) document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'font-sans !font-semibold',
            style: {
              border: '2px solid #000',
              borderRadius: '14px',
              background: '#FFFAE5',
              color: '#000',
              boxShadow: '4px 4px 0 0 #000',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
