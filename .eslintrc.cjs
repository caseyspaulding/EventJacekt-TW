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
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended', // Optional accessibility rules
    'next/core-web-vitals' // Adds Next.js-specific linting rules
  ],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'off', // Changed to 'off' as per recommendation
        '@typescript-eslint/no-unused-vars': 'warn', // Display warnings instead of errors
        '@typescript-eslint/no-explicit-any': 'off' // Disable rule for 'any' type usage
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    
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
    'no-unused-vars': 'warn', // Show warnings for unused variables (non-TypeScript files)
    'no-undef': 'off' // Disable undefined variable checks for cases like `process`
  }
}
