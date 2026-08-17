/**
 * @file App.jsx
 * @description Main application entry component.
 */

import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import router from './router';

const THEME_STORAGE_KEY = 'hms-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem(
    THEME_STORAGE_KEY,
  );

  if (
    savedTheme === 'light' ||
    savedTheme === 'dark'
  ) {
    return savedTheme;
  }

  return 'light';
}

function ThemeManager({ children }) {
  const [theme, setTheme] = useState(
    getInitialTheme,
  );

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', theme);

    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      theme,
    );
  }, [theme]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      if (
        event.key === THEME_STORAGE_KEY &&
        (event.newValue === 'light' ||
          event.newValue === 'dark')
      ) {
        setTheme(event.newValue);
      }
    };

    window.addEventListener(
      'storage',
      handleThemeChange,
    );

    return () => {
      window.removeEventListener(
        'storage',
        handleThemeChange,
      );
    };
  }, []);

  useEffect(() => {
    window.__HMS_THEME__ = {
      getTheme: () => theme,

      setTheme: (nextTheme) => {
        if (
          nextTheme === 'light' ||
          nextTheme === 'dark'
        ) {
          setTheme(nextTheme);
        }
      },

      toggleTheme: () => {
        setTheme((currentTheme) =>
          currentTheme === 'dark'
            ? 'light'
            : 'dark',
        );
      },
    };

    return () => {
      delete window.__HMS_THEME__;
    };
  }, [theme]);

  return children;
}

export default function App() {
  return (
    <ThemeManager>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeManager>
  );
}