'use strict';

var nodePath = require('path');
var fs = require('fs');

require('chai').config.includeStack = true;

var lassoBabelTransform = require('../');

describe('lasso-babel-transform' , function() {
    require('./autotest').scanDir(
        nodePath.join(__dirname, 'autotests'),
        function (dir, helpers, done) {
            var test = require(nodePath.join(dir, 'test.js'));

            var transformConfig = test.getTransformConfig() || {};
            var transform = lassoBabelTransform.createTransform(transformConfig);

            function transformWrapper(path, lassoContext) {
                var filename = nodePath.resolve(dir, path);
                if (!lassoContext) {
                    lassoContext = {};
                }

                lassoContext.filename = filename;
                var code = fs.readFileSync(filename, { encoding: 'utf8' });
                var transformedCode = transform(code, lassoContext);
                return transformedCode;
            }

            test.test(transformWrapper, helpers);
            done();
        });
});