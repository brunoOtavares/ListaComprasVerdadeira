import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        // external: ['firebase/firestore']
      }
    },
    // Configuração para lidar com roteamento do lado do cliente
    server: {
      // Middleware para fallback para index.html em rotas não encontradas
      middlewareMode: false,
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Se a requisição não for para um arquivo estático, retorna index.html
          if (!req.url.includes('.') && req.url !== '/') {
            req.url = '/'
          }
          next()
        })
      }
    }
  }
})
