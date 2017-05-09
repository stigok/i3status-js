const es = require('event-stream')
const exec = require('child_process').exec

const cmd = 'nmcli m'

//es.child(exec(cmd))
process.stdin
  .pipe(es.split())
  .pipe(es.through(function (stdout) {
    const match = stdout.match(/^wlp2s0: (.+)$/)
    if (match) this.emit('data', match[1])
  }))
  .pipe(es.through(function (status) {
    console.log(`DEBUG: ${status}`)
    if (status === 'disconnected') {
      this.emit('data', `${status}\n`)
    } else if (status === 'using connection') {
      const connection = status.match(/using connection \'(.+)\'/)
      this.emit('data', `${connection[1]}`)
    }
  }))
  .pipe(process.stdout)

