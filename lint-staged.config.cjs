const path = require('node:path')
const { ESLint } = require('eslint')

/**
 * @param {string} file
 */
function toRelative(file) {
    return path.relative(process.cwd(), file)
}

/**
 * @param {string[]} files
 */
async function removeIgnoredFiles(files) {
    const eslint = new ESLint()
    const isIgnored = await Promise.all(
        files.map((file) => eslint.isPathIgnored(file)),
    )
    const filteredFiles = files.filter((_, i) => !isIgnored[i])
    return filteredFiles
}

/** @type {import('lint-staged').Config} */
const config = {
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

module.exports = config
