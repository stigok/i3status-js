# statusbar-js

Loads files from `commands.d/` in alphabetical order and prints their output in in a status bar-like fashion.

![i3 statusbar-js](https://s.42.fm/img/2017-05-19-001853.png)

## Usage

The program `require`s all files in `PLUGIN_DIR` and invokes their exported function with a single argument `ctx`.

### Options

The program reads some environment variables

- `INTERVAL` (Default: 1000) Main program update interval in milliseconds
- `PLUGIN_DIR` (Default: `./commands.d`) Directory path to read command files
- `NOCLEAR` (Default: `undefined`) Don't clear terminal buffer on each iteration. Set to any truthy value.

### The `ctx` object

A unique context object is passed to each invoked function. The `value` property is read on each iteration of the main programs update interval. If necessary, the refresh function may be called to force a statusbar refresh immediately. This is useful when you require instant feedback for e.g. volume status or network events. See example files for how these are used.

```javascript
{
  value: '…',
  refresh: <function>
}
```

## Example Command Files

Since the command function is only invoked once, intervals and timeouts may be used to keep the values fresh.

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
