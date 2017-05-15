const execFile = require('child_process').execFile

const interval = 60 * 1000
const endpoint = 'https://ip.42.fm/'

function update(ctx) {
  execFile('curl', ['-s'], (err, stdout, stderr) => {
    if (err) {
      ctx.value = '(wan ip failed)'
      return
    }
    ctx.value = stdout.toString()
  })
}

module.exports = ctx => {
  update(ctx)
  setInterval(() => update(ctx), interval)
}

