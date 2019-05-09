module.exports = {
  extends: ['last', 'prettier/react', 'plugin:react/recommended', 'plugin:import/errors', 'plugin:import/warnings'],
  plugins: ['react', 'react-hooks'],
  parserOptions: {
    ecmaFeatures: {
      ecmaVersion: 7,
      jsx: true,
    },
  },

  rules: {
    'import/order': [
      'error',
      {
        'newlines-between': 'always-and-inside-groups',
      },
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-return-assign': ['error', 'except-parens'],
    'no-confusing-arrow': ['error', { allowParens: true }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always', { omitLastInOneLineBlock: true }],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      pragma: 'React',
      version: '16',
    },
    'import/resolver': {
      alias: {
        map: [['@todomvc/test_support', './src/__tests__/support/'], ['@todomvc/*', './src']],
        extensions: ['.ts', '.js', '.jsx', '.json'],
      },
    },
  },
  env: {
    es6: true,
    browser: true,
    jest: true,
    jasmine: true,
    worker: true,
  },
  globals: {
    __dirname: false,
    global: false,
    process: false,
    module: true,
    fixture: true,
  },
};
