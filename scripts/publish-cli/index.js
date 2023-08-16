const { program } = require('commander')
const publish = require('./lib/publish')

program
  .command('publish')
  .description('publish new version')
  .action(() => {
    publish()
  })

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
