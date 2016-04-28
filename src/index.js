var loadBabelConfig = require('./util/loadBabelConfig');
var nodePath = require('path');
var extend = require('raptor-util/extend');

var babel;

function getBabel() {
    if (!babel) {
        babel = require('babel-core');
    }
    return babel;
}


exports.createTransform = function(transformConfig) {
    return function(code, lassoContext) {
        var filename = lassoContext.filename;
        if (!filename) {
            // This shouldn't be the case
            return code;
        }

        var dir = nodePath.dirname(filename);
        var babelConfig = loadBabelConfig(dir);

        if (!babelConfig) {
            // No babel config... Don't do anything
            return code;
        }

        var babel = getBabel();
        var babelOptions = {};
        extend(babelOptions, babelConfig);
        babelOptions.babelrc = false; // Specify whether or not to use .babelrc and .babelignore files.
        babelOptions.filename = filename;
        babelOptions.filenameRelative = nodePath.relative(babelOptions.sourceRoot, filename);

        var result = babel.transform(code, babelOptions);
        // ...
        return result.code;
    };
};