/** @type {import('eslint').Linter.Config} */
const config = {
    ignorePatterns: [
        '**/node_modules/**',
        '**/build/**',
        '**/coverage/**',
        '**/cache/**',
        '**/commitlint.config.cjs',
        '**/lint-staged.config.cjs',
        '**/vitest.config.ts',
        '**/prettier.config.cjs',
        '**/.eslintrc.cjs',
    ],
    root: true,
    env: {
        node: true,
        es2022: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
    },
    plugins: ['@typescript-eslint'],
    extends: [
        // Common
        'eslint:recommended',
        'plugin:import/recommended',
        // TS
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
        // Prettier
        'plugin:prettier/recommended',
    ],
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
    rules: {
        'import/newline-after-import': 'error',
        'import/order': [
            'error',
            {
                'newlines-between': 'always',
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
        'object-shorthand': ['error', 'always'],
        'no-console': 'error',
        'func-style': ['error', 'declaration'],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/promise-function-async': 'error',
        '@typescript-eslint/consistent-type-imports': [
            'warn',
            {
                prefer: 'type-imports',
                fixStyle: 'inline-type-imports',
            },
        ],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_' },
        ],
    },
}

module.exports = config
