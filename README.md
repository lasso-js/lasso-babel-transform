# lasso-babel-transform

Lasso.js transform that uses Babel to transpile ES6 code to ES5. This transform will only transpile code that for where a `.babelrc` file is found by searching up the directory tree to the root.

## Installation

```bash
npm install lasso-babel-transform --save
```

## Usage

```javascript
require('lasso').configure({
    require: {
        transforms: [
            {
                transform: 'lasso-babel-transform'
                config: {
                    ...
                }
            }
        ]
    }
});
```