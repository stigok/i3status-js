const spawn = require('child_process').spawn
const extract = require('../utils').extract

module.exports = (ctx) => {
  const log = spawn('nmcli', ['device', 'monitor'], {encoding: 'utf8'})

  log.stdout.on('data', data => {
    const matches = extract(/^(\w+): ([^\n]+)$/, data.toString().replace(/\n+/g, ''))
    ctx.value = matches.join(': ')
    ctx.refresh()
  })

  log.stderr.on('data', data => {
    // TODO: bind to ctx.error()
    console.error('data', data)
  })

  ctx.value = 'nmcli mon'
}

