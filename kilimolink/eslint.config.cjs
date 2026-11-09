// Monorepo-root ESLint flat config (kilimolink/).
//
// This directory has NO node_modules of its own — dependencies live in the
// backend/ and web/ workspaces. The previous version did a bare
// `require('@typescript-eslint/parser')`, which Node resolves by walking UP
// the tree, never DOWN into a sibling workspace, so it always threw
// "Cannot find module '@typescript-eslint/parser'" and broke `npm run lint`
// in every workspace that fell back to this file.
//
// Each workspace now ships its own eslint.config.cjs (backend/, web/) and is
// the config ESLint actually uses when cwd is that workspace. This root file
// exists only so a stray `npx eslint` run from kilimolink/ degrades gracefully
// instead of crashing.
const path = require('path');

function tryRequire(moduleId, fromDir) {
  try {
    return require(require.resolve(moduleId, { paths: [fromDir] }));
  } catch {
    return null;
  }
}

const backendDir = path.join(__dirname, 'backend');
const webDir = path.join(__dirname, 'web');
const tsParser =
  tryRequire('@typescript-eslint/parser', backendDir) ||
  tryRequire('@typescript-eslint/parser', webDir);

const tsBlock = tsParser
  ? [
      {
        files: ['backend/**/*.ts', 'web/**/*.{ts,tsx}'],
        languageOptions: {
          parser: tsParser,
          parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
        },
        rules: { 'no-unused-vars': 'off', 'no-undef': 'off' },
      },
    ]
  : [];

module.exports = [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', 'archive/**'] },
  ...tsBlock,
  {
    files: ['**/*.{js,cjs,mjs,jsx}'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
    rules: { 'no-unused-vars': 'off', 'no-undef': 'off' },
  },
];
