export default [
  {
    ignores: ['node_modules/', 'build/', 'dist/', 'coverage/'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: await import('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      '@typescript-eslint': await import('@typescript-eslint/eslint-plugin')
    }
  }
]
