import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-empty-function": "warn",
      "no-unused-vars": "warn",
      "no-trailing-spaces": "warn",
      "semi": [
        "warn",
        "never",
      ],
      "quotes": [
        "warn",
        "double",
      ],
      "jsx-quotes": [
        "warn",
        "prefer-double",
      ],
      "object-curly-spacing": [
        "warn",
        "always",
      ],
      "eol-last": [
        "warn",
        "always",
      ],
      "array-bracket-spacing": [
        "warn",
        "never",
      ],
      "computed-property-spacing": [
        "warn",
        "never",
      ],
      "comma-dangle": [
        "warn",
        "always-multiline",
      ],
      "comma-spacing": [
        "warn",
        {
          "before": false,
          "after": true,
        },
      ],
      "no-multiple-empty-lines": [
        "warn",
        {
          "max": 1,
          "maxEOF": 0,
        },
      ],
      "no-console": [
        "warn",
        {
          "allow": [
            "warn",
            "error",
          ],
        },
      ],
      "keyword-spacing": [
        "warn",
        {
          "before": true,
          "after": true,
        },
      ],
    },
  },
]

export default eslintConfig
