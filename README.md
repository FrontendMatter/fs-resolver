# fs-resolver
[![npm version](https://badge.fury.io/js/fs-resolver.svg)](https://badge.fury.io/js/fs-resolver)
[![Build Status](https://travis-ci.org/themekit/fs-resolver.svg?branch=master)](https://travis-ci.org/themekit/fs-resolver)
[![Coverage Status](https://coveralls.io/repos/themekit/fs-resolver/badge.svg?branch=master&service=github)](https://coveralls.io/github/themekit/fs-resolver?branch=master)

Resolve and load files and directories from multiple filesystem search paths.

Initially developed to resolve Swig template files for [AdminPlus Lite Bootstrap Theme](https://github.com/themekit/adminplus).

## Usage

### Search paths

```js
var Loader = require('fs-resolver')
var path = require('path')

var loader = new Loader([
    process.cwd(),
    path.join(process.cwd(), 'test')
]);
```

### Resolve path to file

```js
loader.resolve('assets/a.txt') // -> /full/path/to/test/assets/a.txt
loader.resolve('test/assets/a.txt') // -> /full/path/to/test/assets/a.txt
```

### Resolve path to directory

```js
loader.resolve('assets', undefined, dir = true) // -> /full/path/to/test/assets/
loader.resolve('test/assets', undefined, dir = true) // -> /full/path/to/test/assets/
```

### Load file sync

```js
loader.load('assets/a.txt') -> // contents of /full/path/to/test/assets/a.txt
```

### Load file async

```js
new Promise(function(resolve, reject) {
    loader.load( 'assets/a.txt', function(err, data) {
        if (err) return reject(err);
        resolve(data);
    });
})
.then(function(data) {
    // data = contents of /full/path/to/test/assets/a.txt
});
```