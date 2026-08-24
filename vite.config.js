/**
 * @file vite.config.js
 * @description Vite configuration and source path aliases for the SyncStays HMS frontend.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  server: {
    open: '/login',
  },
  plugins: [react()],

  resolve: {
    alias: {
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@components': fileURLToPath(
        new URL('./src/components', import.meta.url)
      ),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      '@constants': fileURLToPath(
        new URL('./src/constants', import.meta.url)
      ),
      '@services': fileURLToPath(
        new URL('./src/services', import.meta.url)
      ),
    },
  },
});