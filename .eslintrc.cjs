/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended'
  ],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'warn' // Changed to warn instead of error for leniency
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
    // React specific rules
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off', // No longer needed in React 17+
    'react/jsx-uses-vars': 'off', // Reduced severity

    // Accessibility specific rules
    'jsx-a11y/anchor-is-valid': 'off',

    // Tailwind CSS specific rules
    'tailwindcss/enforces-shorthand': 'off',
    'tailwindcss/no-custom-classname': 'off',

    // TypeScript specific rules
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Less strict about return types
    '@typescript-eslint/no-explicit-any': 'off', // Allow use of 'any', but warn about it

    // General rules
    'no-console': 'off', // Allow console logs
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }] // Warn for unused vars but allow unused function arguments prefixed with an underscore
  }
}
