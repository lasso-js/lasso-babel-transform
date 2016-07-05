var expect = require('chai').expect;

exports.config = {
    extensions: ['.foo']
};

exports.test = function(transform, helpers) {

    var excluded = transform('hello.bar');
    var included = transform('hello.foo');

    expect(excluded).to.equal(helpers.readFileSync('hello.bar'));
    expect(included).to.not.equal(helpers.readFileSync('hello.foo'));
};