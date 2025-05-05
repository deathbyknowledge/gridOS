import path from "path"
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import { redwood } from "@redwoodjs/sdk/vite";

export default defineConfig({
  plugins: [redwood(), tailwindcss()],
  environments: {
    ssr: {}
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
