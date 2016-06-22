'use strict';
var nodePath = require('path');
var fs = require('fs');
require('chai').config.includeStack = true;
var lassoBabelTransform = require('../');

describe('lasso-babel-transform', function() {
    require('./autotest').scanDir(
        nodePath.join(__dirname, 'autotests'),
        function(dir, helpers, done) {
            var test = require(nodePath.join(dir, 'test.js'));

            function transformWrapper(path) {
                const filename = nodePath.resolve(dir, path);
                const transformedStream = lassoBabelTransform(filename);
                const fileStream = fs.createReadStream(filename);
                return new Promise((resolve, reject) => {
                    fileStream.pipe(transformedStream);
                    let str = '';
                    transformedStream.on('data', chunk => (str += chunk));
                    transformedStream.on('end', () => resolve(str));
                    transformedStream.on('error', err => reject(err));
                });
            }

            test.test(transformWrapper, helpers, done);
        }
    );
});