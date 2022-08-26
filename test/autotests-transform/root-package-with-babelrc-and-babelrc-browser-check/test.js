var expect = require('chai').expect;

exports.test = async function(transform, helpers) {
    expect(await transform('excluded/foo.js')).to.equal(helpers.readFileSync('excluded/foo.js'));
    expect(await transform('included-babelrc/foo.js')).to.not.equal(helpers.readFileSync('included-babelrc/foo.js'));
    expect(await transform('included-package/foo.js')).to.equal(helpers.readFileSync('included-package/foo.js'));
};
