/**
 * ESLint Rules: https://eslint.org/docs/rules/
 */
module.exports = {
  root: true,
  // https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
  env: {
    es2021: true,
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    createDefaultProgram: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  ignorePatterns: ['*.min.js', 'node_modules/'],

  settings: {
    polyfills: ['fetch', 'Promise'],
  },

  rules: {
    'eslint-comments/no-unused-disable': 'error',
    'eslint-comments/no-use': [
      'error',
      {
        allow: ['eslint-disable-next-line'],
      },
    ],
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: false }],
    'eslint-comments/require-description': ['error', { ignore: [] }],
    'eslint-comments/no-restricted-disable': [
      'error',
      '*',
      '!no-console',
      '!prettier',
      '!no-labels',
    ],
    'arrow-parens': ['error', 'as-needed'],
    'brace-style': 'off', // handled by prettier
    'comma-spacing': 'off', // handled by prettier
    'constructor-super': 'error',
    complexity: ['error', 10],
    'default-param-last': 'error',
    eqeqeq: 'error',
    'func-name-matching': ['error', 'always'],
    'guard-for-in': 'error',
    'lines-between-class-members': 'off',
    'max-depth': ['error', 4],
    'max-len': [
      'error',
      {
        code: 140,
        comments: 140,
        ignoreStrings: true,
        ignorePattern: '// eslint-disable',
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'max-lines': ['error', { max: 600, skipBlankLines: true }],
    'max-lines-per-function': ['error', { max: 45, skipBlankLines: true, skipComments: true }],
    'max-nested-callbacks': ['error', 4],
    'max-params': ['error', 12],
    'no-alert': 'error',
    'no-await-in-loop': 'error',
    'no-bitwise': 'error',
    'no-dupe-class-members': 'error',
    'no-caller': 'error',
    'no-confusing-arrow': 'error',
    'no-console': 'error',
    'no-constructor-return': 'error',
    'no-continue': 'error',
    'no-debugger': 'error',
    'no-duplicate-case': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-empty': 'error',
    'no-empty-function': 'error',
    'no-fallthrough': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-parens': 'error',
    'no-extra-boolean-cast': 'error',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-invalid-this': 'off', // keep off
    'no-labels': ['error', { allowSwitch: true }],
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-magic-numbers': [
      'error',
      {
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true,
        ignore: [-1, 0, 1],
      },
    ],
    'no-new-wrappers': 'error',
    'no-param-reassign': 'error',
    'no-plusplus': 'error',
    'no-restricted-imports': ['error', 'rxjs/Rx'],
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow': 'error',
    'no-shadow-restricted-names': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-undefined': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'no-unused-labels': 'error',
    'no-useless-catch': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    'prefer-spread': 'error',
    'prefer-promise-reject-errors': 'error',
    'prettier/prettier': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off', // handled by simple-import-sort/sort
    radix: 'error',
    'require-atomic-updates': 'error',
    'require-await': 'error',
    'require-jsdoc': 'off', // keep off
    yoda: ['error', 'never'],
  },

  overrides: [
    {
      files: ['**/*.js'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        createDefaultProgram: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:eslint-comments/recommended',
      ],
      plugins: [
        'prettier',
        'simple-import-sort', // https://github.com/lydell/eslint-plugin-simple-import-sort
        'eslint-comments', // https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/
      ],
    },
    {
      files: '**/init.js',
      rules: {
        'eslint-comments/no-restricted-disable': [
          'error',
          '*',
          '!no-console',
          '!prettier',
          '!no-labels',
          '!no-undef',
        ],
      },
    },
    {
      files: ['**/.eslintrc.js', '**/commitlint.*.js'],
      rules: {
        'no-magic-numbers': 'off',
      },
    },
  ],
};
