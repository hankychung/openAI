const path = require('path')
const fs = require('fs')

const reloadLibs = () => {
  const libs = fs
    .readdirSync(path.resolve(__dirname, '../../../libs'))
    .filter((i) => i !== '.DS_Store')

  return libs
}

module.exports = { reloadLibs }
