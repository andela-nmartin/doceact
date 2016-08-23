var url = 'http://localhost:4000';
var expect = require('chai').expect;
var request = require('superagent');

describe('Roles', function() {
  it('validates that the seeded roles are stored in database', function(done) {
    request
      .get(url + '/api/users/roles')
      .end(function(err, res) {
        // expected responses after seeding
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);
        if (res.body[0].id === 1) {
          expect(res.body[0].title).to.equal('Administrator');
        } else if (res.body[0].id === 2) {
          expect(res.body[0].title).to.equal('User');
        } else if (res.body[1].id === 1) {
          expect(res.body[1].title).to.equal('Administrator');
        } else if (res.body[1].id === 2) {
          expect(res.body[1].title).to.equal('User');
        }
        done();
      });
  });

  it('validates that a new role created has a unique title', function(done) {
    request
      .post(url + '/api/users/roles')
      .send({
        id: 1,
        title: 'Administrator'
      })
      .end(function(err, res) {
        expect(res.status).to.equal(409);
        expect(res.body.code).to.equal(11000);
        expect(res.body.index).to.equal(0);
        expect(res.body.errmsg).to.contain('E11000 duplicate key error');
        done();
      });
  });
});
