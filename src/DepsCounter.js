'use strict';

var p    = require('@fand/promisify');
var fs   = require('fs');
var path = require('path');

var getRootPath = require('./getRootPath');

function each(xs, callback) {
  return xs.reduce((prev, x) => prev.then(() => callback(x)), Promise.resolve());
};


class DepsCounter {

  constructor (opts) {
    this.opts         = opts;
    this.depsCounts   = {};
    this.currentDepth = 0;
  }

  /**
   * @param {string} cwd
   */
  readPackageJson (cwd) {
    var filePath = path.resolve(cwd, 'package.json');

    return p(fs.readFile)(filePath, 'utf8').then(JSON.parse).then((obj) => {
      if (this.opts.dependencies && obj.dependencies) {
        Object.keys(obj.dependencies).forEach((pkg) => {
          this.depsCounts[pkg] = (this.depsCounts[pkg] || 0) + 1;
        });
      }
      if (this.opts.devDependencies && obj.devDependencies) {
        Object.keys(obj.devDependencies).forEach((pkg) => {
          this.depsCounts[pkg] = (this.depsCounts[pkg] || 0) + 1;
        });
      }
    })
    .catch(e => {});
  }

  /**
   * @param {string} cwd
   * @param {number} currentDepth
   * @return {Promise}
   */
  readNodeModules (cwd, currentDepth) {
    if (currentDepth === this.opts.depth) { return Promise.reject('Depth limit over'); }

    return p(fs.readdir)(cwd).then((dirs) => each(dirs, (dir) => {
      if (path.basename(dir).match(/^@.*$/)) {
        return this.readScopedPackage(path.resolve(cwd, dir), currentDepth);
      }
      return this.readDir(path.resolve(cwd, dir), currentDepth);
    }))
    .catch(e => {});
  }

  /**
   * @param {string} cwd
   * @param {number} currentDepth
   * @return {Promise}
   */
  readScopedPackage (cwd, currentDepth) {
    return p(fs.readdir)(cwd).then((dirs) => each(dirs, (dir) => {
      return this.readDir(path.resolve(cwd, dir), currentDepth);
    }));
  }

  /**
   * @param {string} dirPath
   * @returns {Promise}
   */
  readDir (dirPath, currentDepth) {
    return Promise.all([
      this.readPackageJson(dirPath),
      this.readNodeModules(path.resolve(dirPath, 'node_modules'), currentDepth + 1),
    ])
    .catch(e => {});
  }

  readProjectTop () {
    if (this.opts.global) { return  Promise.resolve(); }
    return this.readPackageJson(this.opts.path);
  }

  readProject () {
    this.depsCounts   = {};

    return this.readProjectTop()
      .then(() => getRootPath(this.opts.path, this.opts.global))
      .then((rootPath) => this.readNodeModules(rootPath, 0))
      .then(() => this.depsCounts);
  }

}

module.exports = DepsCounter;
