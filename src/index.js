'use strict';
const path = require('path');
const fs = require('fs');
const cachingFS = require('lasso-caching-fs');
const stripJsonComments = require('strip-json-comments');
const lassoPackageRoot = require('lasso-package-root');
const readOptions = { encoding: 'utf8' };

const logger = require('raptor-logging').logger('lasso-babel-transform');
const loggerCache = require('raptor-logging').logger('lasso-babel-transform/cache');
const caches = new WeakMap();

let babel;

function getBabel() {
    if (!babel) {
        babel = require('@babel/core');
    }
    return babel;
}

function readAndParse(path) {
    return JSON.parse(stripJsonComments(
        fs.readFileSync(path, readOptions)));
}

let cacheNumber = 0;
module.exports = {
    id: __filename,
    stream: false,
    createTransform(transformConfig) {

        const logInfoEnabled = logger.isInfoEnabled();
        const logDebugEnabled = logger.isDebugEnabled();
        const loggerCacheDebugEnabled = loggerCache.isDebugEnabled();

        let extensions = transformConfig.extensions;

        if (!extensions) {
            extensions = ['.js', '.es6'];
        }

        logger.info('These extensions will be transformed: ' + JSON.stringify(extensions));

        let memoryCachedExtensions = transformConfig.memoryCachedExtensions === undefined && extensions || [];

        logger.info('These extensions will be CACHED: ' + JSON.stringify(memoryCachedExtensions));

        extensions = extensions.reduce((lookup, ext) => {
            if (ext.charAt(0) !== '.') {
                ext = '.' + ext;
            }
            lookup[ext] = true;
            return lookup;
        }, {});

        memoryCachedExtensions = memoryCachedExtensions.reduce((lookup, ext) => {
            if (ext.charAt(0) !== '.') {
                ext = '.' + ext;
            }
            lookup[ext] = true;
            return lookup;
        }, {});

        return function lassoBabelTransform(code, lassoContext) {
            let filename = lassoContext.filename;
            const ext = path.extname(filename);

            if (!filename || !extensions.hasOwnProperty(ext)) {
                // This shouldn't be the case
                return code;
            }

            const shouldMemoryCache = memoryCachedExtensions.hasOwnProperty(ext);

            let lasso = lassoContext.lasso;
            let cache;
            if (shouldMemoryCache) {
                cache = caches.get(lasso); 
                if (!cache) {
                    logger.debug('Creating a new cache');
                    cacheNumber++;
                    cache = { cacheNumber }; // Save the number of caches being created
                    caches.set(lasso, cache);
                }

                if (cache) {
                    let cachedCode = cache[filename];

                    if (cachedCode) {
                        if (loggerCacheDebugEnabled) loggerCache.debug('CACHE HIT (#' + cache.cacheNumber + '): ' + filename);
                        return cachedCode;
                    }
                }
            }

            let babelOptions = transformConfig.babelOptions;

            if (!babelOptions) {
                let curDir = path.dirname(filename);
                let rootPackage = lassoPackageRoot.getRootPackage(path.dirname(filename));
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

                babelOptions.cwd = rootDir;
            }

            babelOptions.filename = filename;
            babelOptions.babelrc = false;
            let babel = getBabel();
            let resultCode;

            const start = Date.now();
            let result = babel.transformSync(code, babelOptions);
            const ms = Date.now()  - start;
            if(result == null) {
              // "ignore" and "only" disable ALL babel processing of a file
              // e.g. => .babelrc = { "only": ["included/**"] }
              // transform('excluded/foo.js') will return null
              if (logDebugEnabled) logger.debug('File ' + filename + ' was NOT compiled ( ' + ms + ' ms)');
              resultCode = code;
            } else {
              if (logInfoEnabled)  logger.info('File ' + filename + ' was COMPILED ( ' + ms + ' ms)');
              resultCode = result.code;
            }

            if (cache) 
                cache[filename] = resultCode;{
                if (loggerCacheDebugEnabled) loggerCache.debug('File ' + filename + ' was CACHED(#' + cache.cacheNumber + ')');
            }
            return resultCode;
        };
    }
};