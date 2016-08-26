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

function readAndParse(path) {
    return JSON.parse(stripJsonComments(
        fs.readFileSync(path, readOptions)));
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

            let curDir = path.dirname(filename);

            while (true) {
                let babelrcPath = path.join(curDir, '.babelrc');
                let babelrcBrowserPath = path.join(curDir, '.babelrc-browser');

                // First we check for a .babelrc-browser in the directory, if it
                // exists, we read it and break. If not, we do the same for a
                // .babelrc file. Otherwise, we fall back to looking for a
                // package.json in the same directory with a "babel" key.
                if (cachingFS.existsSync(babelrcBrowserPath)) {
                    babelOptions = readAndParse(babelrcBrowserPath);
                    rootDir = curDir;
                    break;
                } else if (cachingFS.existsSync(babelrcPath)) {
                    babelOptions = readAndParse(babelrcPath);
                    rootDir = curDir;
                    break;
                } else {
                    let packagePath = path.join(curDir, 'package.json');
                    if (cachingFS.existsSync(packagePath)) {
                        let packageJson = readAndParse(packagePath);

                        if (packageJson.babel) {
                            babelOptions = packageJson.babel;
                            rootDir = curDir;
                            break;
                        }
                    }
                }

                if (curDir === rootPackage.__dirname) {
                    break;
                } else {
                    let parentDir = path.dirname(curDir);
                    if (!parentDir || parentDir === curDir) {
                        break;
                    }
                    curDir = parentDir;
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
