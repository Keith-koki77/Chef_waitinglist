import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import GAListener from './components/Shared/GAListener.jsx'
import ReactGA from "react-ga4"

// Initialize GA outside the component
const GA_ID = import.meta.env.VITE_GA_ID;
if (GA_ID) {
  ReactGA.initialize(GA_ID);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GAListener />
      <App />
    </BrowserRouter>
  </StrictMode>,
)