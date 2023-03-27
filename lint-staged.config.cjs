const path = require('node:path')
const { ESLint } = require('eslint')

function toRelative(file) {
	return path.relative(process.cwd(), file)
}

async function removeIgnoredFiles(files) {
	const eslint = new ESLint()
	const isIgnored = await Promise.all(
		files.map((file) => eslint.isPathIgnored(file))
	)
	const filteredFiles = files.filter((_, i) => !isIgnored[i])
	return filteredFiles
}

module.exports = {
	'*': async (files) => {
		const filesToFormat = files.map(toRelative).join(' ')

		return [`prettier --check ${filesToFormat}`]
	},
	'**/*.ts': async (files) => {
		const filesToLint = (await removeIgnoredFiles(files))
			.map(toRelative)
			.join(' ')

		return [`eslint --max-warnings=0 ${filesToLint}`]
	},
}
