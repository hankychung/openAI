const baseUrl = 'https://api-test.flyele.vip'
const axios = require('axios')

module.exports = (server) => {
  console.log('server', server)
  server.use(async (ctx, next) => {
    const path = ctx.path

    if (path.startsWith('/api/')) {
      const targetUrl = `${baseUrl}${ctx.url.replace('/api/', '/')}`

      let headers = {}

      headers['Authorization'] = ctx.request.header.authorization

      try {
        const res = await axios({
          method: 'get',
          url: targetUrl,
          headers
        })

        console.log('check ressss', res)

        if (res.status === 200) {
          // 返回数据
          ctx.body = res.data
          // 设置响应头
          ctx.set('Content-Type', 'application/json')
        } else {
          ctx.status = res.status
          ctx.body = {
            success: false
          }
          ctx.set('Content-Type', 'application/json')
        }
      } catch (e) {
        console.log('check error', e)
        ctx.body = {
          success: false
        }
        ctx.set('Content-Type', 'application/json')
      }
    } else {
      await next()
    }
  })
}
