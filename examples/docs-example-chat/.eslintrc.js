/* eslint-env node */
module.exports = {
  extends: [
    '../../.eslintrc.js',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
      },
    },
  },
};
