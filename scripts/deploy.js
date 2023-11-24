const path = require('path')

const fs = require('fs')

const docPath = path.resolve(__dirname, '../docs')

try {
  fs.rmSync(docPath, { recursive: true, force: true })
} catch (e) {
  console.log(e)
}

fs.cpSync(path.resolve(__dirname, '../dist/apps/web'), docPath, {
  recursive: true
})
