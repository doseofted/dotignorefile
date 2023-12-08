import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/bin.ts"],
  target: "es2022",
  format: ["esm"],
  dts: true,
  clean: true,
});
