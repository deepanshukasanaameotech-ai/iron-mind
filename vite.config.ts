import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/groq': {
            target: 'https://api.groq.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/groq/, ''),
            secure: true,
          }
        }
      },
      plugins: [react()],
      define: {
        // 'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY), 
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
