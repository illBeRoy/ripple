import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GH_PAGES_DEPLOY === 'true' ? '/ripple/' : '/',
  resolve: {
    alias: {
      jimp: 'jimp/browser/lib/jimp',
    },
  },
});
