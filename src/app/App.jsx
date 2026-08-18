/**
 * @file App.jsx
 * @description Main Application entry component initializing AuthProvider and RouterProvider.
 */
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import router from './router';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
