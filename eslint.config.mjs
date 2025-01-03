import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:tailwindcss/recommended",
  ),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "no-console": "error",
      "no-duplicate-imports": "error",
      "simple-import-sort/imports": "error",
      "sort-imports": "off",
      eqeqeq: ["error", "smart"],
      "import/no-relative-packages": "error",
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
    },
  },
];

export default eslintConfig;
