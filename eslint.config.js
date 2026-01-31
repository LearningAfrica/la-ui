import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier, // Must be last to override other configs
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "padding-line-between-statements": [
        "error",
        // Always require blank lines after directive (like 'use-strict'), import, or cjs-import
        { blankLine: "always", prev: "directive", next: "*" },
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
        // Always require blank lines before and after class declaration, function, block-like
        { blankLine: "always", prev: "*", next: ["class", "function", "export"] },
        { blankLine: "always", prev: ["class", "function"], next: "*" },
        // Always require blank lines before return statements
        { blankLine: "always", prev: "*", next: "return" },
        // Always require blank lines before and after const/let/var blocks
        { blankLine: "always", prev: "*", next: ["const", "let", "var"] },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
        // Always require blank lines before and after if statements
        { blankLine: "always", prev: "*", next: "if" },
        { blankLine: "always", prev: "if", next: "*" },
        // Always require blank lines before and after loops
        { blankLine: "always", prev: "*", next: ["for", "while", "do"] },
        { blankLine: "always", prev: ["for", "while", "do"], next: "*" },
        // Always require blank lines before and after switch
        { blankLine: "always", prev: "*", next: "switch" },
        { blankLine: "always", prev: "switch", next: "*" },
        // Always require blank lines before and after try
        { blankLine: "always", prev: "*", next: "try" },
        { blankLine: "always", prev: "try", next: "*" },
      ],
      // Disable react-refresh/only-export-components rule
      "react-refresh/only-export-components": "off",
    },
  },
]);
