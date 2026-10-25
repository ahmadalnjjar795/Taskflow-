import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import App from './App.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { ThemeModeProvider } from './contexts/ThemeContext.jsx';
import { TaskProvider } from './contexts/TaskContext.jsx';
import { ModalProvider } from './contexts/ModalContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeModeProvider>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3500}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <BrowserRouter>
            <AuthProvider>
              <TaskProvider>
                <ModalProvider>
                  <App />
                </ModalProvider>
              </TaskProvider>
            </AuthProvider>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeModeProvider>
    </LanguageProvider>
  </React.StrictMode>
);
