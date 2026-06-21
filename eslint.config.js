const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/**', 'web-build/**', 'functions/lib/**'],
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];
