import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [vue()],
// })

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      command === 'build' ? viteStaticCopy({
        targets: [
          {
            src: 'src/assets/*',  // Source folder
            dest: 'src/assets',       
          },
        ],
      }) : null,
    ].filter(Boolean),
    resolve: {
      alias: {
        "#": path.resolve(__dirname, "./src/"),
      },
    },
  }
});
