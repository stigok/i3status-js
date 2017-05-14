# statusbar-js

Loads files from `commands.d/` in alphabetical order and prints their output in reverse order in a status bar-like fashion.

## command files

```
// Updates timestamp every second
module.exports = (ctx) => {
  setInterval(() => {
    ctx.value = 'Epoch: ' + Date.now()
  }, 1000)
}
```

# License

CC-0
