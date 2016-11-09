'use strict';

const exec = require('./exec-promise');
const util = require('util');

// Update interval (ms)
const updateInterval = process.argv[2] || 3000;
const debugging = process.argv.indexOf('--debug') >= 0;
const separator = ' | ';

const commands = require('./commands.js');

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

    return exec(item.cmd).then(stdout => {
      timer.ended = Date.now();
      return item.actions.map(fn => fn(stdout));
    });
  });

  // Wait for all commands to finish then print results
  Promise.all(promises).then(results => {
    // Clear the console
    process.stdout.write('\x1B[2J\x1B[0f');

    const output = results
      .map(r => Array.isArray(r) ? r.join(separator) : r)
      .join(separator);

    // Join and write command outputs
    console.log(output);

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
