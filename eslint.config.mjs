import { FlatCompat } from '@eslint/eslintrc'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:tailwindcss/recommended',
    'prettier',
  ),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-unused-vars': 'off',

      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      'no-console': 'error',
      'no-duplicate-imports': 'error',
      'simple-import-sort/imports': 'error',
      'sort-imports': 'off',
      eqeqeq: ['error', 'smart'],
      'import/no-relative-packages': 'error',
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',

      'tailwindcss/no-custom-classname': [
        'error',
        {
          whitelist: ['task-outside-click'],
        },
      ],
    },
  },
]

export default eslintConfig
