const utils = require('../utils.js')
const execFile = require('child_process').execFile

const interval = 20 * 1000

function update(ctx) {
  execFile('amixer', ['get', 'Master'], (err, stdout) => {
    const volume = utils.extract(/(\d{1,3}\%)/m, stdout.toString())
    const muted = stdout.toString().match(/\[off\]/)
    ctx.value = `♬ ${muted ? 'muted' : volume}`
  })
}

module.exports = ctx => {
  update(ctx)
  setInterval(() => update(ctx), interval)
}

