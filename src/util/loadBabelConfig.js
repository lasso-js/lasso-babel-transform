var nodePath = require('path');
var fs = require('fs');
var babelConfigByDirCache = {};
var babelConfigCache = {};

function readBabelConfig(path) {
    var babelConfig = babelConfigCache[path];

    if (babelConfig === undefined) {
        var json;

        try {
            json = fs.readFileSync(path, { encoding: 'utf8' })            ;
        } catch(e) {}

        babelConfig = json ? JSON.parse(json) : null;
        babelConfigCache[path] = babelConfig;
    }

    return babelConfig;
}

function loadBabelConfig(dirname) {
    var babelConfig = babelConfigByDirCache[dirname];
    if (babelConfig !== undefined) {
        return babelConfig;
    }

    var currentDir = dirname;
    while (true) {
        var babelConfigPath = nodePath.join(currentDir, '.babelrc');
        
        var currentBabelConfig = readBabelConfig(babelConfigPath);
        if (currentBabelConfig) {
            babelConfig = currentBabelConfig;
            babelConfig.sourceRoot = currentDir;
            break;
        }

        var parentDir = nodePath.dirname(currentDir);
        if (!parentDir || parentDir === currentDir) {
            break;
        }
        currentDir = parentDir;
    }

    babelConfigByDirCache[dirname] = babelConfig || null;

    return babelConfig;
}

module.exports = loadBabelConfig;