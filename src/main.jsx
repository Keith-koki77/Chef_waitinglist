import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom' // Added Router imports
import './index.css'
import App from './App.jsx'
import ReactGA from "react-ga4"

// Initialize GA outside the component
const GA_ID = import.meta.env.VITE_GA_ID;
if (GA_ID) {
  ReactGA.initialize(GA_ID);
}

// A small helper component to track page views on route changes
const GAListener = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GAListener /> {/* Tracks navigation automatically */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)