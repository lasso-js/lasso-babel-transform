var expect = require('chai').expect;

exports.test = function(transform, helpers) {
    expect(transform('excluded/foo.js')).to.equal(helpers.readFileSync('excluded/foo.js'));
    expect(transform('included-babelrc/foo.js')).to.not.equal(helpers.readFileSync('included-babelrc/foo.js'));
    expect(transform('included-package/foo.js')).to.equal(helpers.readFileSync('included-package/foo.js'));
};
