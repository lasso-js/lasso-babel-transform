var expect = require('chai').expect;

exports.test = async function(transform, helpers) {
    expect(await transform('excluded/foo.js')).to.equal(helpers.readFileSync('excluded/foo.js'));
    expect(await transform('included/foo.js')).to.not.equal(helpers.readFileSync('included/foo.js'));
};
