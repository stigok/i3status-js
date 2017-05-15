const utils = require('../utils.js')
const execFile = require('child_process').execFile
const os = require('os')
const path = require('path')
const interval = 5 * 60 * 1000

const todos = path.join(os.homedir(), 'docs', 'TODO')

function update(ctx) {
  execFile('wc', ['-l', todos], (err, stdout) => {
    const count = utils.extract(/^(\d{1,3})/, stdout.toString())
    ctx.value = `TODOs: ${count}`
  })
}

module.exports = ctx => {
  update(ctx)
  setInterval(() => update(ctx), interval)
}

