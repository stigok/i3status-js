'use strict';

const exec = require('./exec-promise');

// Update interval (ms)
const updateInterval = 3000;

const commands = [
  // Networking
  {
    cmd: 'ip address',
    actions: [
      data => {
        let matches = [];
        data.replace(/([\d.]{8,20})/g, (str, match) => matches.push(match));
        matches = matches.filter(m => !m.startsWith('127'));
        return 'IP: ' + matches[0];
      }
    ]
  },
  {
    cmd: 'nmcli connection show --active',
    actions: [
      data => {
        let matches = [];
        data.replace(/(^\w+)(?:.+vpn)/m, (str, match) => matches.push(match));
        if (!matches.length) {
          return 'VPN: no';
        }
        return 'VPN: ' + matches[0];
      }
    ]
  },
  // Brightness
  {
    cmd: 'setbrightness',
    actions: [
      data => 'Brightness: ' + data.match(/level is (\d+)/)[1]
    ]
  },
  // Battery
  {
    cmd: 'acpi --battery',
    actions: [
      data => 'Battery: ' + data.match(/(\d{1,3}%)/)[1]
    ]
  },
  // Time
  {
    cmd: 'date +"%F %R:%S"',
    actions: [
      data => 'Time: ' + data.replace('\n', '')
    ]
  }
];

// Run the status update worker
(function worker() {
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
    console.log(results.join(' | '));

    // Start the worker again after a while
    setTimeout(worker, updateInterval);
  });
})();
