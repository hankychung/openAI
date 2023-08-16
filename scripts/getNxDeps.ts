const config = require('../tsconfig.base.json')

const deps = Object.keys(config.compilerOptions.paths)

export { deps }
