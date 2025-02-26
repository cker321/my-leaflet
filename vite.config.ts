import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import terser from '@rollup/plugin-terser';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': process.env
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external: ['leaflet'],
      output: [
        // ES Module 完整版本
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src/lib',
          exports: 'named',
          dir: 'dist/es'
        },
        // ES Module 压缩版本
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src/lib',
          exports: 'named',
          plugins: [
            terser({
              format: {
                comments: false
              },
              compress: {
                drop_console: true,
                drop_debugger: true
              }
            })
          ],
          dir: 'dist/es/min'
        },
        // UMD 完整版本
        {
          format: 'umd',
          name: 'MyLeafletComponents',
          entryFileNames: 'index.umd.js',
          exports: 'auto',
          globals: {
            leaflet: 'L'
          },
          dir: 'dist'
        },
        // UMD 压缩版本
        {
          format: 'umd',
          name: 'MyLeafletComponents',
          entryFileNames: 'index.umd.min.js',
          exports: 'auto',
          globals: {
            leaflet: 'L'
          },
          plugins: [
            terser({
              format: {
                comments: false
              },
              compress: {
                drop_console: true,
                drop_debugger: true
              }
            })
          ],
          dir: 'dist'
        }
      ]
    },
    minify: false,
    sourcemap: true,
    cssCodeSplit: false,
    assetsDir: 'assets',
    emptyOutDir: true
  }
});
