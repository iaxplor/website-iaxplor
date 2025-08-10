module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: ['standard'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'no-console': ['warn', { allow: ['error', 'warn'] }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: ['dist', 'node_modules']
};

