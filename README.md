# lasso-babel-transform

Lasso.js transform that uses Babel to transpile ES6 code to ES5.

## Prerequisites

This transform requires Lasso v2+

## Installation

> lasso 2.x/3.x, babel 7.x, lasso-babel-transform 2.x
```bash
npm install lasso-babel-transform @babel/core
```

> lasso 2.x/3.x, babel 6.x, lasso-babel-transform 1.x
```bash
npm install lasso-babel-transform@1
```

## Usage

By default, this plugin will look for a `.babelrc` while traversing up the root directory of the packages and
will transpile any files that have the `.js` or `.es6` extension. If a `.babelrc` file does not exist, it
will attempt to look for a `.babelrc-browser` file. If neither of those files exist, this plugin will look in
the `package.json` for a `babel` property.

You can specify different file extensions with the `extensions` option in the transform's config (shown below).
Files are cached in memory by default. You can use `memoryCachedExtensions` to remove caching on some files if you prefer.

```javascript
require('lasso').configure({
    require: {
        transforms: [
            {
                transform: 'lasso-babel-transform',
                config: {
                    extensions: ['.marko', '.js', '.es6'] // Enabled file extensions. Default: ['.js', '.es6']
                    memoryCachedExtensions: ['.js', '.es6'] // Enabled memory caching for these file extensions. Default: same of 'extensions'
                }
            }
        ]
    }
});
```

### Global babel options

Alternatively, babel options can be provided directly via the config. **Note:** Specifying babel options directly
will cause **all** files to be transpiled with these options (regardless of what is specified in the package's `.babelrc`,
 `.babelrc-browser`, or `babel` property in the `package.json`).

```javascript
require('lasso').configure({
    require: {
        transforms: [
            {
                transform: 'lasso-babel-transform',
                config: {
                    // directly specify babel options
                    babelOptions: {
                        presets: [ "@babel/preset-env" ]
                    }
                }
            }
        ]
    }
});
```

## Configuring Babel

You will want to put a `.babelrc` or `.babelrc-browser` file at the root of each package that has any JavaScript files that should
be transpiled by Babel. For example:

_my-module/.babelrc:_

```javascript
{
    "exclude": ["excluded/**"],
    "presets": [ "@babel/preset-env" ]
}
```

As mentioned above, you can also opt to use the `babel` property to the `package.json`.

_my-module/package.json:_
```javascript
{
    "name": "my-module",
    ...
    "babel": {
        // babel config goes here
    }
}
```

You will need to install any Babel plugins enabled in your babel config. For example:

```bash
npm install @babel/preset-env --save
```

## Debugging

Add this at the beginning of your main file:

```javascript
require('raptor-logging').configure({
    loggers: {
        'lasso-babel-transform': 'DEBUG', // or Info
        'lasso-babel-transform/cache': 'DEBUG'
    }
});
```