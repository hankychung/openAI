const inquirer = require('inquirer')
const cp = require('child_process')
const chalk = require('chalk')
const { reloadLibs } = require('./reload-libs')

const versionList = [
  {
    name: '修订号(patch)：当你做了向下兼容的问题修正。',
    value: 'patch'
  },
  {
    name: '次版本号(minor)：当你做了向下兼容的功能性新增',
    value: 'minor'
  },
  {
    name: '主版本号(major)：当你做了不兼容的API 修改',
    value: 'major'
  }
]

const libs = reloadLibs().map((i) => ({
  name: i,
  value: i
}))

const chooseLib = async () => {
  const { lib } = await inquirer.prompt([
    {
      type: 'list',
      name: 'lib',
      message: 'choose a publishable lib',
      choices: libs
    }
  ])

  return lib
}

const publishFlow = async () => {
  const lib = await chooseLib()

  const { output } = await updateVersion(lib)

  build(lib)

  publish(lib, output)
}

const build = (lib) => {
  console.log(chalk.cyan('打包中，请稍后...'))

  cp.execSync(`yarn nx run ${lib}:build`)

  console.log(chalk.green(`${lib} 打包成功`))
}

/**
 * 版本号选择更改
 */
const updateVersion = async function (lib) {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'version',
      message: '选择本次更新的版本',
      choices: versionList.map((item) => ({
        name: item.name,
        value: item.value
      }))
    }
  ])

  const { version } = answer

  const isDirty = cp.execSync('git status -s', {
    encoding: 'utf8'
  })

  if (isDirty) {
    console.log(chalk.red('工作区不干净, 通过git commit/stash清空工作区域'))
    throw new Error()
  }

  const output = cp.execSync(`npm version ${version}`, {
    cwd: `./libs/${lib}`,
    encoding: 'utf-8'
  })

  console.log(chalk.green(`${lib} 版本号修改成功: ${output}`))

  return {
    output
  }
}

const publish = (lib, output) => {
  console.log(chalk.cyan('发布至npm，请稍后...'))

  cp.execSync('npm publish --registry https://npm.flyele.vip/', {
    cwd: `./dist/libs/${lib}`
  })

  console.log(chalk.green('成功发布至npm！'))

  console.log(chalk.cyan('生成commit中，请稍后...'))

  cp.execSync(`git add . && git commit -m "chore: 发布${lib}: ${output}"`)

  cp.execSync(`git tag ${lib}-${output}`)

  cp.execSync('git push --tags')

  console.log(chalk.green('新版本commit生成成功，且已生成tag推送至git'))
}

module.exports = publishFlow
