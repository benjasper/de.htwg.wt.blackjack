module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/essential',
		'@vue/standard',
		'@vue/typescript/recommended'
	],
	parserOptions: {
		ecmaVersion: 2020
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'space-before-function-paren': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'object-curly-spacing': 'off',
		'no-tabs': 'off',
		'indent': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'no-extra-bind': 'off',
		'no-constant-condition': 'off'
	}
}
