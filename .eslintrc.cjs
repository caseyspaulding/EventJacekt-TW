/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'eslint:recommended',
    
  ],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'error'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    },
    tailwindcss: {
      callees: ['twMerge', 'createTheme'],
      classRegex: '^(class(Name)|theme)?$'
    }
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
    'tailwindcss/enforces-shorthand': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'next/next/no-img-element': 'off',
    '@typescript-eslint/consistent-type-imports': 'off'
  }
}
