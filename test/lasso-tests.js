'use strict';
var nodePath = require('path');
var fs = require('fs');
require('chai').config.includeStack = true;
var lassoBabelTransform = require('../');
var lasso = require('lasso');
var buildDir = nodePath.join(__dirname, 'build');
var sandboxLoad = require('./util').sandboxLoad;
var rmdirRecursive = require('./util').rmdirRecursive;

describe('lasso-babel-transform', function() {
    this.timeout(10000);

    require('./autotest').scanDir(
        nodePath.join(__dirname, 'autotests-lasso'),
        function(dir, helpers, done) {
            var testName = nodePath.basename(dir);
            var outputDir = nodePath.join(buildDir, testName);

            rmdirRecursive(outputDir);

            var lassoConfig = {
                urlPrefix: './',
                outputDir: outputDir,
                require: {
                    transforms: [
                        lassoBabelTransform
                    ]
                },
                fingerprintsEnabled: false,
                bundlingEnabled: false
            };

            var myLasso = lasso.create(lassoConfig);

            var lassoOptions = {};
            lassoOptions.pageName = testName;
            lassoOptions.from = dir;
            lassoOptions.dependencies = [
                'require-run: ' + nodePath.join(dir, 'client.js')
            ];

            myLasso.lassoPage(lassoOptions, function(err, lassoPageResult) {
                if (err) {
                    return done(err);
                }

                var modulesRuntimeGlobal = myLasso.config.modulesRuntimeGlobal;

                var sandbox = sandboxLoad(lassoPageResult, modulesRuntimeGlobal);
                sandbox.$outputDir = lassoConfig.outputDir;

                var check = require(nodePath.join(dir, 'test.js')).check;

                if (check.length === 2) {
                    check(sandbox.window, done);
                } else {
                    check(sandbox.window);
                    done();
                }
            });
        }
    );
});