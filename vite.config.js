import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages needs /TP/ base, Alibaba Cloud OSS uses /
// After OSS registration: set DEPLOY_TARGET=oss
// For local verification: set DEPLOY_TARGET=local (uses relative paths)
const base = process.env.DEPLOY_TARGET === 'oss' ? '/' : process.env.DEPLOY_TARGET === 'local' ? './' : '/TP/'

export default defineConfig({
  plugins: [react()],
  base,
})
