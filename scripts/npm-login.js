const cp = require('child_process')

/**
 author: william   email:362661044@qq.com
 create_at:2022/7/4 下午 6:11
 **/

const login = (type) => {
  const exec = cp.exec(`${type} adduser --registry https://npm.flyele.vip/`)

  exec.stdout.on('data', (data) => {
    if (data.toString().includes('Username')) {
      exec.stdin.write('flyele-developer\n')
    }
    if (data.toString().includes('Password')) {
      exec.stdin.write('NpmpRoxy5Wxverda\n')
    }
    if (data.toString().includes('Email')) {
      exec.stdin.write('flyele@flyele.net\n')
    }
  })

  exec.on('close', (code) => {
    console.log(`${type} 用户名设置完毕! \n`)
    // cp.execSync(`${type} config set always-auth true`)
    // cp.execSync(
    //   'yarn add flyele-components@latest --registry=https://npm.flyele.vip/'
    // )
  })
}

login('npm')
login('yarn')
