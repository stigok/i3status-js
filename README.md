# statusbar-js

Loads files from `commands.d/` in alphabetical order and prints their output in in a status bar-like fashion.

![i3 statusbar-js](https://s.42.fm/img/2017-05-19-001853.png)

## Example command file

```javascript
// Updates timestamp every second
module.exports = (ctx) => {
  setInterval(() => {
    ctx.value = 'Epoch: ' + Date.now()
  }, 1000)
}

// Print CPU temp
function update (ctx) {
  fs.readFile('/sys/devices/platform/coretemp.0/hwmon/hwmon0/temp2_input', (err, contents) => {
    const temp = Number(contents) / 1000
    ctx.value = `P1: ${temp}°`
  })
}

module.exports = (ctx) => {
  update(ctx)
  setInterval(() => update(ctx), 10000)
}
```

See [commands.d/](https://github.com/stigok/statusbar-js/tree/develop/commands.d) for more working examples.

# License

CC-0
