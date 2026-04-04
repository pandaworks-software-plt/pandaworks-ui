import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  base: "/pandawork-ui/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@/components/ui": path.resolve(__dirname, "../../packages/registry/registry/default"),
      "@/lib/utils": path.resolve(__dirname, "../../packages/registry/src/lib/utils"),
      "@/hooks": path.resolve(__dirname, "../../packages/registry/src/hooks"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
