'use strict';

var minimist        = require('minimist');
var whatDoIDependOn = require('./whatDoIDependOn');
var view            = require('./view');

process.stdout.on('error', (err) => {
  if (err.code === "EPIPE") {
    process.exit(0);
  }
});

const VERSION = '0.0.1';

var optionator = require('optionator')({
  prepend : 'Usage : what-do-i-depend-on [path]',
  options : [{
    option      : 'dependencies',
    alias       : 'pro',
    type        : 'Boolean',
    description : 'Show only dependencies.',
  }, {
    option      : 'devDependencies',
    alias       : 'dev',
    type        : 'Boolean',
    description : 'Show only devDependencies.',
  }, {
    option      : 'global',
    alias       : 'g',
    type        : 'Boolean',
    description : 'Show dependencies for packages installed globally.',
  }, {
    option      : 'rows',
    alias       : 'r',
    type        : 'Number',
    description : 'Limit the number of packages on the output.',
    example     : 'what-do-i-depend-on --rows 10',
  }, {
    option      : 'depth',
    alias       : 'd',
    type        : 'Number',
    description : 'Limit the depth to search dependencies recursively.',
    example     : 'what-do-i-depend-on --depth 1',
  }, {
    option      : 'json',
    alias       : 'j',
    type        : 'Boolean',
    description : 'Output result in JSON format.',
  }, {
    option      : 'version',
    alias       : 'v',
    type        : 'Boolean',
    description : 'Show version.',
  }, {
    option      : 'help',
    alias       : 'h',
    type        : 'Boolean',
    description : 'Show this help.',
  }],
});

function getOpts () {
  var opts = optionator.parseArgv(process.argv);
  opts.path = opts._[0] || '.';

  // Enable both deps if there is no explicit opts
  if (!opts.dependencies && !opts.devDependencies) {
    opts.dependencies = opts.devDependencies = true;
  }

  return opts;
}

function main () {
  try {
    var opts = getOpts();
  }
  catch(e) {
    console.log(e.message);
    return;
  }

  if (opts.version) {
    console.log(VERSION);
    return;
  }
  if (opts.help) {
    console.log(optionator.generateHelp());
    return;
  }

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
