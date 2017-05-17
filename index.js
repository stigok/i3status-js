#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const cwd = path.dirname(process.argv[1])
const mapObject = require('./utils').mapObject

const pluginDir = process.env.PLUGIN_DIR || path.join(cwd, 'commands.d/')
const separator = ' | '
const clearScreen = process.env.NOCLEAR ? '\n' : '\x1B[2J\x1B[0f'
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
  if (updated !== statusbar) {
    statusbar = updated
    process.stdout.write(clearScreen + '\n')
    process.stdout.write(updated)
  }
}

function update () {
  write(contexts.map(ctx => ctx.value).join(separator))
}

setInterval(update, updateInterval)

