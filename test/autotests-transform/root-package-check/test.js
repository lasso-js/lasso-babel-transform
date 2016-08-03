var expect = require('chai').expect;

exports.test = function(transform, helpers) {
    expect(transform('excluded/foo.js')).to.equal(helpers.readFileSync('excluded/foo.js'));
    expect(transform('included/foo.js')).to.not.equal(helpers.readFileSync('included/foo.js'));
};
