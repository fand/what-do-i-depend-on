'use strict';

var Table = require('cli-table2');

function sortDeps (deps, rows) {
  var tuples = [];
  Object.keys(deps).forEach((key) => {
    tuples.push([key, deps[key]]);
  });
  tuples.sort((a, b) => b[1] - a[1]);

  var sortedDeps = {};
  tuples.slice(0, rows).forEach((tuple) => {
    sortedDeps[tuple[0]] = tuple[1];
  });
  return sortedDeps;
}

function renderJson (deps, rows) {
  console.log(JSON.stringify(sortDeps(deps)));
}

function renderTable (deps, rows) {
  var table = new Table({
    head      : ['PACKAGE', 'COUNT'],
    colWidths : [50, 20],
  });

  var sorted = sortDeps(deps, rows);

  Object.keys(sorted).forEach((pkg) => {
    table.push([pkg, deps[pkg]]);
  });

  console.log(table.toString());
}

module.exports = {
  renderJson  : renderJson,
  renderTable : renderTable,
};
