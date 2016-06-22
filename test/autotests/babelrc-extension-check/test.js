var expect = require('chai').expect;

exports.test = function(transform, helpers, done) {
    Promise.all([
        transform('excluded/foo.js'),
        transform('included/foo.js'),
        transform('included/foo.es6'),
        transform('included/foo.coffee')
    ]).then((response) => {
        expect(response[0]).to.equal(helpers.readFileSync('excluded/foo.js'));
        expect(response[1]).to.not.equal(helpers.readFileSync('included/foo.js'));
        expect(response[2]).to.not.equal(helpers.readFileSync('included/foo.es6'));
        expect(response[3]).to.equal(helpers.readFileSync('included/foo.coffee'));
        done();
    }).catch(err => done(err));
};