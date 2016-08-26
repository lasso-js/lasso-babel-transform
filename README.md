# lasso-babel-transform

Lasso.js transform that uses Babel to transpile ES6 code to ES5. This transform will only transpile code if there is a `.babelrc` found while traversing up to the root directory of the package that contains the JavaScript module file.

## Prerequisites

This transform requires Lasso v2+

## Installation

```bash
npm install lasso-babel-transform --save
```

You will also need to install any babel plugins that you enable in your `.babelrc` file. For example:


## Usage

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

## Configuring Babel

You will want to put a `.babelrc` file at the root of each package that has any JavaScript files that should be transpiled by Babel. For example:

_my-module/.babelrc:_

```
{
    "ignore": "excluded/**",
    "plugins": [
        "transform-es2015-template-literals",
        "transform-es2015-literals",
        "transform-es2015-function-name",
        "transform-es2015-arrow-functions",
        "transform-es2015-block-scoped-functions",
        "transform-es2015-classes",
        "transform-es2015-object-super",
        "transform-es2015-shorthand-properties",
        "transform-es2015-duplicate-keys",
        "transform-es2015-computed-properties",
        "transform-es2015-for-of",
        "transform-es2015-sticky-regex",
        "transform-es2015-unicode-regex",
        "check-es2015-constants",
        "transform-es2015-spread",
        "transform-es2015-parameters",
        "transform-es2015-destructuring",
        "transform-es2015-block-scoping",
        "transform-es2015-typeof-symbol"
    ]
}
```

You will need to install any Babel plugins enabled in your `.babelrc` file. For example:

```bash
npm install babel-plugin-transform-es2015-template-literals --save
npm install babel-plugin-transform-es2015-literals --save
npm install babel-plugin-transform-es2015-function-name --save
npm install babel-plugin-transform-es2015-arrow-functions --save
npm install babel-plugin-transform-es2015-block-scoped-functions --save
npm install babel-plugin-transform-es2015-classes --save
npm install babel-plugin-transform-es2015-object-super --save
npm install babel-plugin-transform-es2015-shorthand-properties --save
npm install babel-plugin-transform-es2015-duplicate-keys --save
npm install babel-plugin-transform-es2015-computed-properties --save
npm install babel-plugin-transform-es2015-for-of --save
npm install babel-plugin-transform-es2015-sticky-regex --save
npm install babel-plugin-transform-es2015-unicode-regex --save
npm install babel-plugin-check-es2015-constants --save
npm install babel-plugin-transform-es2015-spread --save
npm install babel-plugin-transform-es2015-parameters --save
npm install babel-plugin-transform-es2015-destructuring --save
npm install babel-plugin-transform-es2015-block-scoping --save
npm install babel-plugin-transform-es2015-typeof-symbol --save
```


** Note: If for any reason you need to not use the default `.babelrc`, you can
use a `.babelrc-browser` file which we will look for before searching looking up
the default `.babelrc` file.
