import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Выделяем React в отдельный чанк
          "vendor-react": ["react", "react-dom"],

          // Выделяем recharts и связанные пакеты в отдельный чанк
          "vendor-charts": ["recharts"],

          // Выделяем остальные зависимости в отдельный чанк
          "vendor-other": ["axios", "lucide-react"],
        },
      },
    },
  },
});
