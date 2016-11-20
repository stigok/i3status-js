'use strict';

const util = require('util');
const commands = require('./commands-powered.js');
// Raise max event listeners to amount of commands
if (commands.length > 10) {
  require('events').EventEmitter.prototype._maxListeners = 100;
}
const execa = require('execa');

// Update interval (ms)
const updateInterval = process.argv[2] || 3000;
const debugging = process.argv.indexOf('--debug') >= 0;
const separator = ' | ';
const clearScreen = '\n\x1B[2J\x1B[0f';
const options = {reject: false};

// Run the status update worker
(function worker() {
  const timers = [];

  // Map all commands into exec promises
  const promises = commands.map(item => {
    // Time individual promise execution
    const timer = {
      name: item.cmd,
      started: Date.now()
    };
    timers.push(timer);

    return execa.shell(item.cmd, options)
      .then(result => {
        timer.ended = Date.now();
        if (debugging && result.failed) console.error(result);
        const data = result.failed ? null : result.stdout;
        return item.actions.map(fn => fn(data));
      });
  });

  // Wait for all commands to finish then print results
  Promise.all(promises).then(results => {
    // Clear the console
    process.stdout.write(clearScreen);

    const output = results
      .map(r => Array.isArray(r) ? r.join(separator) : r)
      .join(separator);

    // Join and write command outputs
    const times = timers.map(t => t.ended - t.started);
    const sum = times.reduce((sum, t) => sum + t, 0)
    const avg = sum / times.length | 0;
    const max = times.reduce((a, b) => a > b ? a : b)
    console.log(`${output} /// ø ${avg}ms / max ${max}ms)`);

    if (debugging) {
      // Print execution profile
      const debugstr = timers.map(t => util.format('cmd: %s @ %d ms', t.name.substring(0, 20), t.ended - t.started));
      console.error('DEBUG: Command timings:');
      debugstr.forEach(str => console.error('DEBUG: ' + str));
    }

    // Start the worker again after a while
    setTimeout(worker, updateInterval);
  })
  .catch(err => {
    console.error('Hit an error', err);
  });
})();
