module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		project: './tsconfig.json',
		ecmaFeatures: {
			modules: true,
		},
	},
	extends: [
		'@smartlook/eslint-config-base',
		'@smartlook/eslint-config-node',
		'@smartlook/eslint-config-typescript',
		'@smartlook/eslint-config-prettier',
	],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.json', '.node', '.ts'],
			},
			typescript: {},
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		node: {
			tryExtensions: ['.js', '.json', '.node', '.ts'],
		},
	},
	rules: {
		'@typescript-eslint/no-magic-numbers': 'off',
	},
}
