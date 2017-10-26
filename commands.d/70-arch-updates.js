const execFile = require('child_process').execFile

// Once every hour
const interval = 3600 * 1000

function update(ctx) {
  execFile('sudo', ['yaourt', '-Sy'], (err, stdout) => {
    if (err) {
      console.error('sudo yaourt -Sy failed', err)
      ctx.value = 'no updates (erred)'
      return
    }
    execFile('yaourt', ['-Qua'], (err, stdout) => {
      if (err) {
        ctx.value = 'no updates'
        return
      }
      ctx.value = '' + stdout.toString().split(/\n/g).filter(str => str.length).length + ' updates!'
    })
  })
}

module.exports = ctx => {
  update(ctx)
  setInterval(() => update(ctx), interval)
}

