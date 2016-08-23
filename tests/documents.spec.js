var url = 'http://localhost:4000';
var expect = require('chai').expect;
var request = require('superagent');
var moment = require('moment');

var user = {
    username: 'smalik',
    password: '12345'
  };

var authToken, userId, doc1id, doc2id, doc3id, doc4id;

var document1 = {
    title: 'Area of Triangle',
    content: 'This is obtained from the base and height. Get half of' +
      ' the base and multiply by the height to get the area.'
  };
var document2 = {
    title: 'Cone',
    content: 'Has a circular base and a pointed top. It is a third of a ' +
      'cylinder'
  };
var document3 = {
    title: 'Perimeter of Rectangle',
    content: 'Obtained by summing the length and width and doubling the result.'
  };
var document4 = {
    title: 'Cylinder',
    content: 'Volume obtained using area of base multiplied by the height.'
  };

describe('Document', function() {
  it('validates that one has to be authenticated to access documents ' +
    '(GET /api/documents)',
    function(done) {
      request
        .get(url + '/api/documents')
        .end(function(err, res) {
          expect(typeof res.body).to.equal('object');
          expect(res.status).to.equal(403);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('No token provided!');
          done();
        });
    });
});

describe('Document tests requiring authentication', function() {
  // perform login function first
  beforeEach(function login(done) {
    request
      .post(url + '/api/users/login')
      .send(user)
      .end(function(err, res) {
        userId = res.body.id;
        authToken = res.body.token;
        done();
      });
  });

  it('validates that a document is created by a user logged in ' +
    '(POST /api/documents)',
    function(done) {
      request
        .post(url + '/api/documents')
        .set('x-access-token', authToken)
        .send(document1)
        .end(function(err, res) {
          doc1id = res.body.document._id;
          expect(res.status).to.equal(200);
          expect(typeof res.body.document).to.equal('object');
          expect(res.body.document._id).to.not.be.undefined;
          expect(res.body.document.title).to.equal(document1.title);
          expect(res.body.document.content).to.equal(document1.content);
          done();
        });
    });

  it('validates that a document is created by a user logged in ' +
    '(POST /api/documents)',
    function(done) {
      request
        .post(url + '/api/documents')
        .set('x-access-token', authToken)
        .send(document2)
        .end(function(err, res) {
          doc2id = res.body.document._id;
          expect(res.status).to.equal(200);
          expect(typeof res.body.document).to.equal('object');
          expect(res.body.document._id).to.not.be.undefined;
          expect(res.body.document.title).to.equal(document2.title);
          expect(res.body.document.content).to.equal(document2.content);
          done();
        });
    });

  it('validates that one has to be authenticated to access documents ' +
    '(GET /api/documents)',
    function(done) {
      request
        .get(url + '/api/documents')
        .set('x-access-token', authToken)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(typeof res.body).to.equal('object');
          expect(res.body.length).to.be.above(0);
          expect(res.body[res.body.length - 1].title).to.equal(document2.title);
          expect(res.body[res.body.length - 1].content).to.equal(document2
            .content);
          done();
        });
    });

  it('validates that all documents, limited by a specified number ' +
    'and ordered by published date, that can be accessed by a ' +
    'role USER, are returned when getAllDocumentsByRoleUser is called',
    function(done) {
      request
        .get(url + '/api/documents/user')
        .set('x-access-token', authToken)
        .end(function(err, res) {
          var itemOne = res.body[0];
          var itemLast = res.body[res.body.length - 2];
          expect(res.status).to.equal(200);
          expect(itemLast.dateCreated).to.equal(itemOne.dateCreated);
          done();
        });
    });

  it('validates that all documents, limited by a specified number, that were' +
    ' published on a certain date, are returned when getAllDocumentsByDate ' +
    'is called',
    function(done) {
      request
        .get(url + '/api/documents/date')
        .set('x-access-token', authToken)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.be.above(1);
          expect(res.body[0].dateCreated).to.contain(moment(new Date())
            .format('YYYY-MM-DD'));
          done();
        });
    });
});

// tests for administrator documents
describe('Administrator Documents', function() {
  beforeEach(function logout(done) {
    request
      .get('http://localhost:4000/api/users/logout')
      .set('x-access-token', authToken)
      .end(function() {
        authToken = '';
        done();
      });
  });

  // login the administrator
  beforeEach(function loginAdmin(done) {
    request
      .post(url + '/api/users/login')
      .send({
        username: 'Sonnie',
        password: '12345'
      })
      .end(function(err, res) {
        userId = res.body.id;
        authToken = res.body.token;
        done();
      });
  });

  it('validates that a document is created by a admin logged in ' +
    '(POST /api/documents)',
    function(done) {
      request
        .post(url + '/api/documents')
        .set('x-access-token', authToken)
        .send(document3)
        .end(function(err, res) {
          doc3id = res.body.document._id;
          expect(res.status).to.equal(200);
          expect('Content-Type', 'json', done);
          expect(typeof res.body.document).to.equal('object');
          expect(res.body.document._id).to.not.be.undefined;
          expect(res.body.document.title).to.equal(document3.title);
          expect(res.body.document.content).to.equal(document3.content);
          done();
        });
    });

  it('validates that a document is created by a admin logged in ' +
    '(POST /api/documents)',
    function(done) {
      request
        .post(url + '/api/documents')
        .set('x-access-token', authToken)
        .send(document4)
        .end(function(err, res) {
          doc4id = res.body.document._id;
          expect(res.status).to.equal(200);
          expect(typeof res.body.document).to.equal('object');
          expect(res.body.document._id).to.not.be.undefined;
          expect(res.body.document.title).to.equal(document4.title);
          expect(res.body.document.content).to.equal(document4.content);
          done();
        });
    });

  it('validates that all documents, limited by a specified number ' +
    'and ordered by published date, that can be accessed by a role ' +
    'ADMINISTRATOR, are returned when ' +
    'getAllDocumentsByRoleAdministrator is called',
    function(done) {
      request
        .get(url + '/api/documents/admin')
        .set('x-access-token', authToken)
        .end(function(err, res) {
          var lastItem = res.body[res.body.length - 1];
          var firstItem = res.body[res.body.length - 2];
          expect(res.status).to.equal(200);
          expect(lastItem.dateCreated).to.equal(firstItem.dateCreated);
          expect(true).to.equal(true);
          done();
        });
    });

  it('validates that any users document can be updated by an ' +
    'Administrator (PUT /api/documents)/:id',
    function(done) {
      request
        .put(url + '/api/documents/' + doc1id)
        .set('x-access-token', authToken)
        .send({
          title: 'Frodo',
          content: 'A character in LOTR.'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(typeof res.body).to.equal('object');
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal('Successfully updated Document!');
          done();
        });
    });

  it('validates that any users document can be deleted by an ' +
    'Administrator (DELETE /api/documents)/:id',
    function(done) {
      request
        .del(url + '/api/documents/' + doc2id)
        .set('x-access-token', authToken)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(typeof res.body).to.equal('object');
          expect(res.body.message.title).to.equal(document2.title);
          expect(res.body.message.content).to.equal(document2.content);
          done();
        });
    });
});
// tests for manipulating documents access
describe('Document tests requiring authentication', function() {
  // logout first
  beforeEach(function logout(done) {
    request
      .get('http://localhost:4000/api/users/logout')
      .set('x-access-token', authToken)
      .end(function() {
        authToken = '';
        done();
      });
  });

  // perform login function first
  beforeEach(function login(done) {
    request
      .post(url + '/api/users/login')
      .send({
        username: 'tn',
        password: '12345'
      })
      .end(function(err, res) {
        userId = res.body.id;
        authToken = res.body.token;
        done();
      });
  });

  it('validates that a document can only be updated by the creator or an ' +
    'Administrator (PUT /api/documents/:id)',
    function(done) {
      request
        .put(url + '/api/documents/' + doc1id)
        .set('x-access-token', authToken)
        .send({
          title: 'Frodo',
          content: 'A character in LOTR.'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(403);
          expect(typeof res.body).to.equal('object');
          expect(res.body.message).to.equal('Forbidden to update this document.');
          done();
        });
    });

  it('validates that a document can only be deleted by the creator or an ' +
    'Administrator (DELETE /api/documents/:id)',
    function(done) {
      request
        .del(url + '/api/documents/' + doc1id)
        .set('x-access-token', authToken)
        .end(function(err, res) {
          expect(res.status).to.equal(403);
          expect(typeof res.body).to.equal('object');
          expect(res.body.message).to.equal('Forbidden to delete this document.');
          done();
        });
    });
});
