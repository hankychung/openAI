const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const concurrently = require('concurrently')
const { exec } = require('child_process')

// 运行环境选项
const envChoices = [
  {
    name: 'DEV环境',
    value: 'dev'
  },
  {
    name: 'TEST环境',
    value: 'test'
  },
  {
    name: 'PRE_PROD环境',
    value: 'pre_prod'
  },
  {
    name: 'PROD环境',
    value: 'prod'
  }
]

/**
 * 所有的应用名
 */
const allPackages = ['apps'].reduce((acc, curr) => {
  const appNames = fs.readdirSync(path.resolve(__dirname, `../${curr}`))
  const items = appNames.map((name) => {
    return {
      name,
      value: {
        name,
        type: curr
      }
    }
  })

  return [...acc, ...items]
}, [])

/**
 * 生成应用串行运行命令
 * @param apps 应用列表
 * @param apiEnv 启动环境
 */
const generateCommands = ({ apps, apiEnv } = {}) => {
  // 下面是多选的代码，目前是单选，因为nx的端口问题，启动多个的话 不会自动切换端口只有一个4200端口
  // console.log('apps', apps)
  // let filterStr = ''
  // for (let i = 0; i < apps.length; i++) {
  //   const { name } = apps[i]
  //   filterStr += ` ${name}`
  // }
  const { name } = apps

  const command = `cross-env NODE_ENV=${apiEnv}-dev nx serve ${name} --host 0.0.0.0`

  return { command }
}

const serve = async () => {
  // 选择API环境
  const { apiEnv } = await inquirer.prompt([
    {
      type: 'list',
      name: 'apiEnv',
      message: '请选择运行环境',
      choices: envChoices
    }
  ])

  // 需要过滤的应用
  const excluded = ['.DS_Store']
  // 应用选项
  const appChoices = allPackages.filter((item) => !excluded.includes(item.name))
  // 选择应用
  const { apps } = await inquirer.prompt([
    {
      type: 'list',
      name: 'apps',
      message: '请选择需要运行的应用',
      choices: appChoices,
      validate: function (answer) {
        if (!answer.length) {
          return '请至少选择一个应用'
        }
        return true
      }
    }
  ])
  // web-client 项目需要询问是否启动代理
  if (apps.name === 'web-client') {
    const { shouldStartProxy } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldStartProxy',
        message: '是否启动代理?',
        default: true
      }
    ])

    if (shouldStartProxy) {
      exec('yarn proxy', (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`)
          return
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`)
          return
        }
        console.log(`stdout: ${stdout}`)
      })
    }
  }

  const { command } = generateCommands({
    apps,
    apiEnv
  })

  concurrently([command], {
    killOthers: ['failure'],
    raw: true,
    prefix: 'name'
  })
}

serve()
