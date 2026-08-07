/**
 * @file App.jsx
 * @description Main Application entry component initializing AuthProvider and RouterProvider.
 */
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import router from './router';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
