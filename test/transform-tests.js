'use strict';
var nodePath = require('path');
var fs = require('fs');
require('chai').config.includeStack = true;
var lassoBabelTransform = require('../');

describe('lasso-babel-transform', function() {
    this.timeout(5000);

    require('./autotest').scanDir(
        nodePath.join(__dirname, 'autotests-transform'),
        function(dir, helpers, done) {
            var test = require(nodePath.join(dir, 'test.js'));

            function transformWrapper(path) {
                const filename = nodePath.resolve(dir, path);
                const transformFunc = lassoBabelTransform.createTransform({});
                var input = fs.readFileSync(filename, { encoding: 'utf8' });
                var output = transformFunc(input, { filename });
                return output;
            }

            test.test(transformWrapper, helpers);
            done();
        }
    );
});