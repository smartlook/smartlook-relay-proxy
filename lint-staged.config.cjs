const path = require('node:path')
const { ESLint } = require('eslint')

async function removeIgnoredFiles(files) {
	const eslint = new ESLint()
	const isIgnored = await Promise.all(
		files.map((file) => eslint.isPathIgnored(file))
	)
	const filteredFiles = files.filter((_, i) => !isIgnored[i])
	return filteredFiles.join(' ')
}

module.exports = {
	'*': async (files) => {
		const relativePaths = files.map((file) =>
			path.relative(process.cwd(), file)
		)
		return [`prettier --check ${relativePaths.join(' ')}`]
	},
	'**/*.ts': async (files) => {
		const filesToLint = await removeIgnoredFiles(files)
		return [`eslint --max-warnings=0 ${filesToLint}`]
	},
}
