const utils = require('../utils.js')
const fs = require('fs')

const interval = 10 * 1000

function update (ctx) {
  fs.readFile('/sys/devices/platform/coretemp.0/hwmon/hwmon0/temp2_input', (err, contents) => {
    //const match = utils.extract(/^MemTotal:\s+(\d+)/gm, contents.toString())
    const temp = Number(contents) / 1000
    ctx.value = 'P1: ' + temp + '°'
  })
}

module.exports = ctx => {
  update(ctx)
  setInterval(() => update(ctx), interval)
}

