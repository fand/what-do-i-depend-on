var childProcess    = require('child_process');

function getRootPath (projectPath, global) {
  var cmd = 'cd ' + projectPath + ' && npm root';
  if (global) {
    cmd += ' -g';
  }

  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, (err, stdout) => {
      if (err) { reject(err); }
      resolve(stdout.trim());
    });
  });
}

module.exports = getRootPath;
