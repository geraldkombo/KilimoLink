// Backend ESLint flat config.
//
// Lives here (not at the monorepo root) so `require` resolves
// @typescript-eslint/parser from backend/node_modules. The root
// kilimolink/eslint.config.cjs cannot resolve it — Node walks UP the
// directory tree for modules, never down into a sibling workspace.
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.js', 'prisma/seed_data/**'],
  },
  {
    files: ['src/**/*.ts', 'test/**/*.ts', 'prisma/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
];
