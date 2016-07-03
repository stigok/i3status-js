'use strict';

const exec = require('./exec-promise');

// Update interval (ms)
const updateInterval = process.argv[2] || 3000;
const separator = '  ';

const commands = require('./commands.js');
const luckyCharm = '⚥';

// Run the status update worker
(function worker() {
  const timeStarted = Date.now();

  // Map all commands into exec promises
  const promises = commands.map(item => {
    return exec(item.cmd).then(stdout => {
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

    // Print status
    const executionTime = Date.now() - timeStarted;
    console.log('%s oneoneone | %s // %sms', luckyCharm, output, executionTime);

    // Start the worker again after a while
    setTimeout(worker, updateInterval);
  });
})();
