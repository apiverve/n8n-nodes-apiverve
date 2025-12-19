module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['n8n-nodes-base'],
	extends: ['plugin:n8n-nodes-base/community'],
	ignorePatterns: ['dist/**', 'node_modules/**'],
	rules: {
		'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
	},
};
