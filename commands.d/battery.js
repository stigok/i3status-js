const execSync = require('child_process').execSync
const utils = require('../utils.js')

module.exports = {
  fn: () => {
    const stdout = execSync('acpi --battery').toString()
    console.log(stdout)
    // TODO: include time left to empty
    const batteryLevel = utils.extract(/(\d{1,3}\%)/, stdout || '')
    const isCharging = !stdout.match(/discharging/i)
    // TODO: Replace strings with icons
    return `${batteryLevel} ${isCharging ? '[pwr]' : '[+/-]'}`
  },
  wait: 3 * 60 * 1000 // every 3 minutes
}
