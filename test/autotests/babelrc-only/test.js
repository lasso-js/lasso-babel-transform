var expect = require('chai').expect;

exports.test = function(transform, helpers, done) {
    Promise.all([
        transform('excluded/foo.js'),
        transform('included/foo.js')
    ]).then((response) => {
        expect(response[0]).to.equal(helpers.readFileSync('excluded/foo.js'));
        expect(response[1]).to.not.equal(helpers.readFileSync('included/foo.js'));
        done();
    }).catch(err => done(err));
};