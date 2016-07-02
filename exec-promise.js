const exec = require('child_process').exec;
const Promise = require('bluebird');

function execPromise(command, options) {
  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) {
        console.error('execPromise error', stderr, err);
        reject(err);
        return;
      }
      resolve(stdout);
    });
  });
}

module.exports = execPromise;
