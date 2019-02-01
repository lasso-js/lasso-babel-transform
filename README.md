# lasso-babel-transform

Lasso.js transform that uses Babel to transpile ES6 code to ES5.

## Prerequisites

This transform requires Lasso v2+

## Installation

```bash
npm install lasso-babel-transform --save
```

You will also need to install any babel plugins that you enable in your `.babelrc` file. For example:


## Usage

By default, this plugin will look for a `.babelrc` while traversing up the root directory of the packages and
will transpile any files that have the `.js` or `.es6` extension. If a `.babelrc` file does not exist, it
will attempt to look for a `.babelrc-browser` file. If neither of those files exist, this plugin will look in
the `package.json` for a `babel` property.

You can specify different file extensions with the `extensions` option in the transform's config (shown below).

```javascript
require('lasso').configure({
    require: {
        transforms: [
            {
                transform: 'lasso-babel-transform',
                config: {
                    extensions: ['.js', '.es6'] // Enabled file extensions. Default: ['.js', '.es6']
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

```
{
    "exclude": ["excluded/**"],
    "presets": [ "@babel/preset-env" ]
}
```

As mentioned above, you can also opt to use the `babel` property to the `package.json`.

_my-module/package.json:_
```
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

