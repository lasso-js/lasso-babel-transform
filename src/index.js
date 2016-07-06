'use strict';
const path = require('path');
const fs = require('fs');
const cachingFS = require('lasso-caching-fs');
const stripJsonComments = require('strip-json-comments');

var lassoPackageRoot = require('lasso-package-root');
var readOptions = { encoding: 'utf8' };

var babel;

function getBabel() {
    if (!babel) {
        babel = require('babel-core');
    }
    return babel;
}

module.exports = {
    id: __filename,
    stream: false,
    createTransform(transformConfig) {

        var extensions = transformConfig.extensions;

        if (!extensions) {
            extensions = ['.js', '.es6'];
        }

        extensions = extensions.reduce((lookup, ext) => {
            if (ext.charAt(0) !== '.') {
                ext = '.' + ext;
            }
            lookup[ext] = true;
            return lookup;
        }, {});

        return function lassoBabelTransform(code, lassoContext) {
            var filename = lassoContext.filename;

            if (!filename || !extensions.hasOwnProperty(path.extname(filename))) {
                // This shouldn't be the case
                return code;
            }

            let babelOptions = null;

            var rootPackage = lassoPackageRoot.getRootPackage(path.dirname(filename));
            var rootDir;

            if (rootPackage.babel) {
                // babel supports putting the babel config in the package's root `package.json`
                // file. If we find that then we will enable the Babel transform for this package
                babelOptions = Object.assign({}, rootPackage.babel);
                rootDir = rootPackage.__dirname;
            } else {
                // Didn't find a babel config in the root `package.json` for the package so we will
                // instead search up until we reach the root directory of the package
                let curDir = path.dirname(filename);
                while (true) {
                    let babelrcPath = path.join(curDir, '.babelrc');

                    if (cachingFS.existsSync(path.join(curDir, '.babelrc'))) {
                        var babelrcJson = stripJsonComments(fs.readFileSync(babelrcPath, readOptions));
                        babelOptions = JSON.parse(babelrcJson);
                        rootDir = curDir;
                        break;
                    } else if (curDir === rootPackage.__dirname) {
                        break;
                    } else {
                        let parentDir = path.dirname(curDir);
                        if (!parentDir || parentDir === curDir) {
                            break;
                        }
                        curDir = parentDir;
                    }
                }
            }

            if (!babelOptions) {
                // No babel config... Don't do anything
                return code;
            }

            babelOptions.filename = path.relative(rootDir, filename);
            babelOptions.babelrc = false;

            var babel = getBabel();
            var result = babel.transform(code, babelOptions);
            return result.code;
        };
    }
};