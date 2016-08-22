(() => {
  'use strict';
  // require the module jsonwebtoken
  const env = process.env.NODE_ENV || 'development';
  const config = require('../config');
  const jsonwebtoken = require('jsonwebtoken');
  const secretKey = config.secretKey;

  module.exports = {
    // function checks for the token
    authenticate: (req, res, next) => {
      console.log('Somebody just came to our app!');
      var token = req.body.token || req.params.token ||
        req.headers['x-access-token'];
      // check if token exists
      if (token) {
        jsonwebtoken.verify(token, secretKey, (err, decoded) => {
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
