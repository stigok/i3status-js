#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const cwd = path.dirname(process.argv[1])

const pluginDir = process.argv.PLUGIN_DIR || path.join(cwd, 'commands.d/')
const separator = ' | '

function loadFiles (cb) {
  const dict = {}
  fs.readdir(pluginDir, (err, files) => {
    if (err) throw err
    files.filter(name => path.extname(name) === '.js')
      .forEach(filename => {
        dict[filename.split('.')[0]] = require(path.join(pluginDir, filename))
      })
    cb(null, dict)
  })
}

loadFiles((err, dict) => {
  if (err) throw err
  else console.log('Fetched ' + Object.keys(dict).length + ' file(s) successfully', dict)

  for (key in dict) {
    const cmd = dict[key]
    // Get initial value
    cmd.currentValue = cmd.fn()
    // Individual command loop
    cmd.interval = setInterval(() => {
      cmd.currentValue = cmd.fn()
    }, cmd.wait)
  }

  // Main update loop
  setInterval(() => {
    statusbar = mapObj(dict).map(cmd => cmd.currentValue).join(separator)
    console.log(statusbar)
  }, 1000)
})

function mapObj (obj) {
  return Object.keys(obj).map(key => obj[key])
}

