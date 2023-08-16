const serve = require('koa-static')
const Koa = require('koa')
const app = new Koa()
const proxy = require('./proxy')

// $ GET /package.json
app.use(serve('./static'))

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
  )
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})

proxy(app)

app.listen(8888)

console.log('listening on port 8888')
