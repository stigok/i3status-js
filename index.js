#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const cwd = path.dirname(process.argv[1])
const mapObject = require('./utils').mapObject

const pluginDir = process.env.PLUGIN_DIR || path.join(cwd, 'commands.d/')
const separator = ' | '
// Appending newline to avoid control chars showing in i3-bar
const clearScreen = process.env.NOCLEAR ? '' : '\x1b[2J\x1b[H\n'
const updateInterval = process.env.INTERVAL || 1000

const dict = {}
const contexts = []

fs.readdir(pluginDir, (err, files) => {
  if (err) throw err
  files.filter(name => path.extname(name) === '.js')
    .map(name => require(path.join(pluginDir, name)))
    .reverse()
    .forEach(fn => {
      const ctx = {refresh: update}
      fn(ctx)
      contexts.push(ctx)
    })
})

let statusbar
function write (updated) {
  if (statusbar !== updated) {
    statusbar = updated
    process.stdout.write(clearScreen + statusbar)
  }
}

function update () {
  write(contexts.map(ctx => ctx.value).join(separator))
}

setInterval(update, updateInterval)

