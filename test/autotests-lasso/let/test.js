var expect = require('chai').expect;

exports.check = function(window, lassoPageResult, helpers) {
    expect(window.name).to.equal('Frank');
};