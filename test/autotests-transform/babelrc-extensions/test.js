var expect = require('chai').expect;

exports.config = {
    extensions: ['.foo']
};

exports.test = async function(transform, helpers) {

    var excluded = await transform('hello.bar');
    var included = await transform('hello.foo');

    expect(excluded).to.equal(helpers.readFileSync('hello.bar'));
    expect(included).to.not.equal(helpers.readFileSync('hello.foo'));
};