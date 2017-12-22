'use strict';
const path = require('path');
const fs = require('fs');
const cachingFS = require('lasso-caching-fs');
const stripJsonComments = require('strip-json-comments');
const lassoPackageRoot = require('lasso-package-root');
const readOptions = { encoding: 'utf8' };

let babel;

function getBabel() {
    if (!babel) {
        babel = require("babel-core");
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

        let extensions = transformConfig.extensions;

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
            let filename = lassoContext.filename;

            if (!filename || !extensions.hasOwnProperty(path.extname(filename))) {
                // This shouldn't be the case
                return code;
            }

            let babelOptions = transformConfig.babelOptions;

            let curDir = path.dirname(filename);
            let rootPackage = lassoPackageRoot.getRootPackage(path.dirname(filename));

            if (!babelOptions) {
                let rootDir;
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
            }

            babelOptions.filename = path.relative(curDir, filename);
            babelOptions.babelrc = false;
            let babel = getBabel();

            let result = babel.transform(code, babelOptions);
            return result.code;
        };
    }
};
