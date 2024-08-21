import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['index.ts'],
  format: ['esm'],

  splitting: true,
  dts: true,
  clean: true,
  target: 'es2022',
  sourcemap: false,
  outDir: 'dist',
})