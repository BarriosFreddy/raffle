import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
  plugins: [react(),
    viteStaticCopy({
      targets: [
        {
          src: '.htaccess',
          dest: './'
        },
      ],
    }),],
  server: {
    host: true,
    port: 5173
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.htaccess'],
    alias: {
      '@': '/src'
    }
  },
  base: '/'
});