import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { devtools } from "@tanstack/devtools-vite";

import netlifyReactRouter from "@netlify/vite-plugin-react-router";

const isNetlify = process.env.VITE_NETLIFY === "true";

export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    ...(mode === "development" ? [devtools()] : []),
    ...(isNetlify ? [netlifyReactRouter()] : []),
  ],
  server: {
    port: 3000,
  },
  build: {
    sourcemap: false,
  },
}));
