import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    assetsDir: './',
    rollupOptions: {
      // inlineDynamicImports: true,
      input: {
        /**
         * 点击插件图标出现的弹窗
         * */
        popup: resolve(__dirname, 'src/popup/index.html'),
        /**
         * 插件的核心 JS，一直活跃在后台，来监听所有请求
         * */
        background: resolve(__dirname, 'src/background.ts'),
        /**
         * 与页面同级，并在某个时机执行，可以拿到页面的 document
         * */
        content: resolve(__dirname, 'src/content.ts'),
        /**
         * 通过content.js嵌入main.js
         * */
        main: resolve(__dirname, 'src/main.ts')
      },
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js'
      }
    }
  }
})
