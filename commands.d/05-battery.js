const utils = require('../utils.js')
const execFile = require('child_process').execFile

const interval = 60 * 1000

function update(ctx) {
  execFile('acpi', ['--battery'], (err, stdout) => {
    const batteryLevel = utils.extract(/(\d{1,3}\%)/, stdout)
    const isCharging = !stdout.match(/discharging/i)
    // TODO: Replace strings with icons
    ctx.value = `${batteryLevel} ${isCharging ? '[pwr]' : '[+/-]'}`
  })
}

module.exports = ctx => {
  update(ctx)
  setInterval(() => update(ctx), interval)
}

