import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { devtools } from "@tanstack/devtools-vite";

import netlifyReactRouter from "@netlify/vite-plugin-react-router";

export default defineConfig({
  plugins: [
    // reactRouterDevTools(),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    devtools(),
    netlifyReactRouter(),
  ],
  build: {
    sourcemap: false,
  },
  server: {
    port: 3000,
    // open: true,
  },
});
