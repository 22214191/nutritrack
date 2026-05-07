export default defineConfig({
  base: '/nutritrack/',
  build: {
    target: 'esnext'
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})