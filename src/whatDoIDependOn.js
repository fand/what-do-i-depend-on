'use strict';

var DepsCounter = require('./DepsCounter');

function whatDoIDependOn (opts) {
  return new DepsCounter(opts).readProject();
}

module.exports = whatDoIDependOn;
