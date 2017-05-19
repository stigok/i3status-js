# statusbar-js

Loads files from `commands.d/` in alphabetical order and prints their output in in a status bar-like fashion.

![i3 statusbar-js](https://s.42.fm/img/2017-05-19-001853.png)

## Usage

The program `require`s all files in `PLUGIN_DIR` and invokes their exported function with a single argument `ctx`.

### Options

The program reads some environment variables

- `INTERVAL` (Default: `1000`) Main program update interval in milliseconds
- `PLUGIN_DIR` (Default: `'./commands.d'`) Directory path to read command files
- `NOCLEAR` (Default: `undefined`) Don't clear terminal buffer on each iteration. Set to any truthy value.

### The `ctx` object

A unique context object is passed to each invoked function.

- `value` (Default: `'…'`) String that will be written to the statusbar.
- `refresh()` invoke to force a statusbar refresh. This is useful when you require instant feedback for e.g. volume meter or network events. See example files for how it can be used.

Defaults:
```javascript
{
  value: '…',
  refresh: <function>
}
```

## Example Command Files

The command's function is only invoked once. Use intervals, timeouts, callbacks or events when the value is expected to change.

```javascript
// Updates timestamp every second
module.exports = (ctx) => {
  setInterval(() => {
    ctx.value = 'Epoch: ' + Date.now()
  }, 1000)
}
```

Create an `update` function to make it easy to return an initial value before the first interval iteration occurs.

```javascript
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

Update on specific events

```javascript
module.exports = (ctx) => {
  const log = spawn('nmcli', ['device', 'monitor'], {encoding: 'utf8'})

  log.stdout.on('data', data => {
    const matches = extract(/^(\w+): ([^\n]+)$/, data.toString().replace(/\n+/g, ''))
    ctx.value = matches.join(': ')
    ctx.refresh()
  })
  
  ctx.value = 'waiting for first update...'
}
```

See [commands.d/](https://github.com/stigok/statusbar-js/tree/develop/commands.d) for more working examples.

## Integrate with i3

Simply edit the `bar` section of the i3 configuration file. On Arch Linux it's typically residing in `~/.config/i3/config`.
Replace the path of the executable to wherever you've cloned this repo.

```
bar {
  status_command exec ~/repos/statusbar-js/index.js 2>> ~/i3status.log
}
```

## Contribute

Please post questions, ideas or bugs as issues. 

## License

CC-0
