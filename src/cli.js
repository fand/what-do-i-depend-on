'use strict';

var minimist        = require('minimist');
var whatDoIDependOn = require('./whatDoIDependOn');
var view            = require('./view');

process.stdout.on('error', (err) => {
  if (err.code === "EPIPE") {
    process.exit(0);
  }
});

function getOpts () {
  var _opts = minimist(process.argv.slice(2));
  var opts = {
    path            : _opts._[0] || '.',
    dependencies    : _opts.pro || _opts.dependencies,
    devDependencies : _opts.dev || _opts.devDependencies,
    global          : _opts.g || _opts.global,
    rows            : _opts.r || _opts.rows,
    depth           : _opts.d || _opts.depth,
    json            : _opts.j || _opts.json,
  };

  // Enable both deps if there is no explicit opts
  if (!opts.dependencies && !opts.devDependencies) {
    opts.dependencies = opts.devDependencies = true;
  }

  return opts;
}

function main () {
  var opts = getOpts();

  whatDoIDependOn(opts).then((deps) => {
    if (opts.json) {
      return view.renderJson(deps);
    }
    else {
      return view.renderTable(deps, opts.rows);
    }
  });
}

main();
