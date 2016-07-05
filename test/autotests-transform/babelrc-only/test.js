var expect = require('chai').expect;

exports.test = function(transform, helpers) {
    var excluded = transform('excluded/foo.js');
    var included = transform('included/foo.js');

    expect(excluded).to.equal(helpers.readFileSync('excluded/foo.js'));
    expect(included).to.not.equal(helpers.readFileSync('included/foo.js'));
};