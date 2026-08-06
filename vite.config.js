import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 需要 /TP/ base，阿里云 OSS 用 /
// 阿里云备案完成后切换：改为 '/' 并设置 DEPLOY_TARGET=oss
const base = process.env.DEPLOY_TARGET === 'oss' ? '/' : '/TP/'

export default defineConfig({
  plugins: [react()],
  base,
})
