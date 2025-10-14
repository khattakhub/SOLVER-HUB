import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import './services/firebase';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SiteSettingsProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </SiteSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);