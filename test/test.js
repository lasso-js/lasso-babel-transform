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
                var filename = nodePath.resolve(dir, path);
                var transformedStream = lassoBabelTransform(filename);
                var fileStream = fs.createReadStream(filename);
                return new Promise((resolve, reject) => {
                    fileStream.pipe(transformedStream);
                    var str = '';
                    transformedStream.on('data', function(chunk) {
                        if(chunk) {
                            str += chunk;
                        }
                    });
                    transformedStream.on('end', function() {
                        resolve(str);
                    });
                });
            }

            test.test(transformWrapper, helpers, done);
        });
});