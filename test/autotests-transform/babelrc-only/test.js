var expect = require('chai').expect;

exports.test = async function(transform, helpers) {
    var excluded = await transform('excluded/foo.js');
    var included = await transform('included/foo.js');

    expect(excluded).to.equal(helpers.readFileSync('excluded/foo.js'));
    expect(included).to.not.equal(helpers.readFileSync('included/foo.js'));
};