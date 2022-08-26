var expect = require('chai').expect;

exports.test = async function(transform, helpers) {
    expect(await transform('excluded/foo.js')).to.equal(helpers.readFileSync('excluded/foo.js'));
    expect(await transform('included/foo.js')).to.not.equal(helpers.readFileSync('included/foo.js'));
    expect(await transform('included/foo.es6')).to.not.equal(helpers.readFileSync('included/foo.es6'));
    expect(await transform('included/foo.coffee')).to.equal(helpers.readFileSync('included/foo.coffee'));
};