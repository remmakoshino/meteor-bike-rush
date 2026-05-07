import { defineConfig } from 'vite';

export default defineConfig({
  base: '/meteor-bike-rush/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('phaser')) {
            return 'phaser';
          }
          return undefined;
        }
      }
    }
  }
});
