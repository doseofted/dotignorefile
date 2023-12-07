import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/bin.ts'],
  target: "es2020",
	format: ["esm"],
	dts: true,
	clean: true,
})
