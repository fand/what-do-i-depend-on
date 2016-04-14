# what-do-i-depend-on

![screen_capture](https://cloud.githubusercontent.com/assets/1403842/14505249/521b81ca-01f3-11e6-89e5-e516129d9f23.png)

> See what you depend on.

[![NPM Version](https://img.shields.io/npm/v/what-do-i-depend-on.svg?style=flat-square)](https://www.npmjs.org/package/wwhat-do-i-depend-on)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://fand.mit-license.org/)

## Installation

```
$ npm install -g what-do-i-depend-on
```

## Usage

Type full command:
```
$ what-do-i-depend-on
```

or just:
```
$ wdido
```

`wdido` takes options.

```
Usage : what-do-i-depend-on [path] [options]

  --dependencies, --pro     Show only dependencies.
  --devDependencies, --dev  Show only devDependencies.
  -g, --global              Show dependencies for packages installed globally.
  -r, --rows Number         Limit the number of packages on the output.
  -d, --depth Number        Limit the depth to search dependencies recursively.
  -j, --json                Output result in JSON format.
  -v, --version             Show version.
  -h, --help                Show this help.
```

# LICENSE

[MIT](http://fand.mit-license.org/)
