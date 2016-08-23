(function() {
  'use strict';
  // require the module jsonwebtoken
  var env = process.env.NODE_ENV || 'development';
  var config = require('../config');
  var jsonwebtoken = require('jsonwebtoken');
  var secretKey = config.secretKey;

  module.exports = {
    // function checks for the token
    authenticate: function(req, res, next) {
      console.log('Authenticated!');
      var token = req.body.token || req.params.token ||
        req.headers['x-access-token'];
      // check if token exists
      if (token) {
        jsonwebtoken.verify(token, secretKey, function(err, decoded) {
          if (err) {
            res.status(403).send({
              success: false,
              message: 'Failed to authenticate user'
            });
          } else {
            if (decoded._doc) {
              req.decoded = decoded._doc;
            } else {
              req.decoded = decoded;
            }
            next();
          }
        });
      } else {
        res.status(403).send({
          success: false,
          message: 'No token provided!'
        });
      }
    }
  };
})();
