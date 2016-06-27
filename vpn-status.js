'use strict';

const exec = require('child_process').exec;
const Promise = require('bluebird');

exec('nmcli c show --active | grep vpn', (error, stdout, stderr) => {
  if (error) {
    console.log('(none)');
    return;
  }
  let connectionName = stdout.match(/^\w+/)[0];
  console.log(`${connectionName}`);
});

function execPromise(command, options) {
  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) {
        return reject(stderr);
      }
      return resolve(stdout);
    });
  });
}
