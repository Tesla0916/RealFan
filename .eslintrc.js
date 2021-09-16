module.exports = {
  extends: [
    '@aloudata/eslint-config-base'
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['**/recoilize/*.js'],
  rules: {
  },
};
