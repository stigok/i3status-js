const execFile = require('child_process').execFile

const interval = 60 * 60 * 1000

function update(ctx) {
  execFile('yaourt', ['-Qua'], (err, stdout) => {
    if (err) {
      ctx.value = 'no updates'
      return
    }
    ctx.value = '' + stdout.toString().split(/\n/g).length + ' updates!'
  })
}

module.exports = ctx => {
  update(ctx)
  setInterval(() => update(ctx), interval)
}

