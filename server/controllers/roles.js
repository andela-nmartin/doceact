(function() {
  'use strict';
  // get the required models and db connection
  var Role = require('../models/roles');

  module.exports = {
    // gets all the saved roles from the db
    get: function(req, res) {
      Role
        .find({})
        .exec(function(err, roles) {
          if (err) {
            res.send(err);
            return;
          } else {
            res.json(roles);
          }
        });
    },

    // creates a role in the db
    create: function(req, res) {
      var role = new Role({
        id: req.body.id,
        title: req.body.title
      });
      role.save(function(err) {
        if (err) {
          res.status(409).send(err);
          return;
        }
        res.json({
          role: role,
          success: true,
          message: 'Role has been created!'
        });
      });
    }
  };
})();
