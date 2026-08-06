import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 需要 /TP/ base，阿里云 OSS 用 /
// 通过环境变量 DEPLOY_TARGET 切换：'gh-pages' 或 'oss'
const base = process.env.DEPLOY_TARGET === 'gh-pages' ? '/TP/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
