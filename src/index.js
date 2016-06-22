'use strict';
const stream = require('stream');
const babel = require('babel-core');
const path = require('path');
const util = require('util');
const fs = require('fs');
const merge = require('lodash/object/merge');
// fetch the .babelrc file. Do it only once because its fixed.
const defaultOptions = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc')));

const BabelStream = function(filename) {
    stream.Transform.call(this);

    let rootDir = path.dirname(filename);
    if (path.extname(filename) !== '.js' && path.extname(filename) !== '.es6') {
        this.data = '';
        this.options = null;
        return;
    }
    while (!fs.existsSync(path.join(rootDir, '.babelrc'))) {
        const newRootDir = path.dirname(rootDir);
        if (newRootDir === rootDir) {
            rootDir = undefined;
            break;
        }
        rootDir = newRootDir;
    }
    if (rootDir) {
        this.options = merge({}, defaultOptions, JSON.parse(fs.readFileSync(path.join(rootDir, '.babelrc'))));
        this.options.filename = path.relative(rootDir, filename);
        this.options.babelrc = false;
    }
    this.data = '';
};

util.inherits(BabelStream, stream.Transform);

BabelStream.prototype._transform = function(buf, enc, callback) {
    this.data += buf;
    callback();
};

BabelStream.prototype._flush = function(callback) {
    if (this.options) {
        const result = babel.transform(this.data, this.options);
        this.push(result.code);
    } else {
        this.push(this.data);
    }
    callback();
};

module.exports = function(filename) {
    return new BabelStream(filename);
};
