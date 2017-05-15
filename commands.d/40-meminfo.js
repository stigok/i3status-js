const utils = require('../utils.js')
const fs = require('fs')
const interval = 1000 // 5 * 60 * 1000

function update (ctx) {
  fs.readFile('/proc/meminfo', (err, contents) => {
    //const match = utils.extract(/^MemTotal:\s+(\d+)/gm, contents.toString())
    const match = utils.extract(/^MemFree:\s+(\d+)/gm, contents.toString())
    ctx.value = 'MF: ' + (Number(match[0]) / 1024 | 0) + ' MB'
  })
}

module.exports = ctx => {
  update(ctx)
  setInterval(() => update(ctx), interval)
}

