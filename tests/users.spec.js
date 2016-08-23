var url = 'http://localhost:4000';
var expect = require('chai').expect;
var request = require('superagent');

describe('Users', function() {
  it('should show that a new user is created ' +
    '(POST /api/users)',
    function(done) {
      request
        .post(url + '/api/users')
        .send({
          username: 'batman',
          firstname: 'Bruce',
          lastname: 'Wayne',
          email: 'batman@cave.com',
          password: '12345',
          role: 2
        })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(typeof res.body).to.equal('object');
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal('User has been created!');
          done();
        });
    });

  it('validates that the new user created is unique ' +
    '(POST /api/users)',
    function(done) {
      request
        .post(url + '/api/users')
        .send({
          username: 'batman',
          firstname: 'Bruce',
          lastname: 'Wayne',
          email: 'batman@cave.com',
          password: '12345',
          role: 2
        })
        .end(function(err, res) {
          expect(res.status).to.equal(403);
          expect(typeof res.body).to.equal('object');
          expect(res.body.code).to.equal(11000);
          expect(res.body.index).to.equal(0);
          done();
        });
    });

  it('validates that all users are returned when getAllUsers ' +
    'function in the controller is called (GET /api/users)',
    function(done) {
      request
        .get(url + '/api/users')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.be.above(0);
          expect(res.body[res.body.length - 1].username).to.equal('batman');
          expect(res.body[res.body.length - 1].email)
            .to.equal('batman@cave.com');
          expect(typeof res.body).to.equal('object');
          done();
        });
    });

  it('validates that the new user created has a defined role, ' +
    'has a first name and a last name',
    function(done) {
      request
        .get(url + '/api/users')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body[res.body.length - 1].role).to.equal('User');
          expect(res.body[res.body.length - 1].name.first).to.equal('Bruce');
          expect(res.body[res.body.length - 1].name.last).to.equal('Wayne');
          done();
        });
    });

  it('validates that a valid user can be logged in', function(done) {
    request
      .post(url + '/api/users/login')
      .send({
        username: 'smalik',
        password: '12345'
      })
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Successfully logged in!');
        expect(res.body.token).to.not.be.undefined;
        done();
      });
  });

  it('validates that an invalid user cannot be logged in', function(done) {
    request
      .post(url + '/api/users/login')
      .send({
        username: 'rupertm',
        password: '67891'
      })
      .end(function(err, res) {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('User does not exist');
        done();
      });
  });
});
