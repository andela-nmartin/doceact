(() => {
  'use strict';
  // get the required models and db connection
  const env = process.env.NODE_ENV || 'development',
    config = require('../config'),
    User = require('../models/users'),
    Role = require('../models/roles'),
    jsonwebtoken = require('jsonwebtoken'),
    secretKey = config.secretKey;

  // create token for authentication
  const createToken = (user) => {
    const token = jsonwebtoken.sign(user, secretKey, {
      expiresIn: 1440
    });
    return token;
  }

  module.exports = {
    // to add a user to the db
    create: (req, res) => {
      const user = new User({
        name: {
          first: req.body.firstname,
          last: req.body.lastname
        },
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      });

      // find a role based on the input on the body
      Role.find({
        id: req.body.role
      }, (err, roles) => {
        if (err) {
          res.send(err);
          return;
        }
        // add the role to the user before being saved
        user.role = roles[0].title;
        // assign a token to the created user
        const token = createToken(user);
        // save the user object
        user.save((err) => {
          if (err) {
            res.status(403).send(err);
          } else {
            res.json({
              success: true,
              message: 'User has been created!',
              token: token
            });
          }
        });
      });
    },

    // to login user into docms system
    login: (req, res) => {
      User.findOne({
        username: req.body.username
      }).exec((err, user) => {
        if (err) {
          throw err;
        }
        if (!user) {
          res.status(401).send({
            message: 'User does not exist'
          });
        } else if (user) {
          const validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.status(401).send({
              message: 'Invalid Password'
            });
          } else {
            // token
            delete user.password;
            const token = createToken(user);
            res.json({
              currentUser: user,
              id: user._id,
              success: true,
              message: 'Successfully logged in!',
              token: token
            });
          }
        }
      });
    },

    // logout function
    logout: (req, res) => {
      delete req.headers['x-access-token'];
      return res.status(200).json({
        'message': 'User has been successfully logged out'
      });
    },

    // to get the mongo cluster of all the users stored on the db
    getAll: (req, res) => {
      User.find({}, (err, users) => {
        if (err) {
          res.send(err);
          return;
        }
        res.json(users);
      });
    },

    // get user by id
    get: (req, res) => {
      const id = req.params.id;
      User.find({
        _id: id
      }, (err, users) => {
        if (err) {
          res.send(err);
          return;
        }
        res.json(users);
      });
    },

    // to get the mongo cluster of all the user roles
    getAllUsersRoles: (req, res) => {
      User.find({
        'role': 'User'
      }, (err, users) => {
        if (err) {
          res.send(err);
          return;
        }
        res.json(users);
      });
    },

    // to get the mongo cluster of all the user roles
    getAllAdminRoles: (req, res) => {
      User.find({
        'role': 'Administrator'
      }, (err, users) => {
        if (err) {
          res.send(err);
          return;
        }
        res.json(users);
      });
    },

    // update user by id
    update: (req, res) => {
      const id = req.params.id;
      // update function
      const updateMe = (id) => {
        User.findOneAndUpdate({
          _id: id
        }, {
          name: {
            first: req.body.firstname,
            last: req.body.lastname
          },
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          role: req.body.role
        }, {
          name: {
            first: req.body.firstname,
            last: req.body.lastname
          },
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          role: req.body.role
        }, (err, users) => {
          if (err) {
            res.send(err);
            return;
          } else if (!users) {
            res.send({
              message: 'Not Authorised to update this user.'
            });
          } else {
            res.json({
              user: users,
              success: true,
              message: 'Successfully updated User!'
            });
          }
        });
      };
      if (req.decoded.role === 'Administrator' && id) {
        const id5 = id;
        updateMe(id5.trim());
      } else if (id) {
        const id6 = req.decoded._id;
        updateMe(id6.trim());
      } else if (req.decoded.role === 'Administrator' && !id) {
        const id7 = req.decoded._id;
        updateMe(id7.trim());
      }
    },

    // delete user by id
    delete: (req, res) => {
      // delete function
      const deleteMe = (id) => {
        User.findOneAndRemove({
            _id: id
          },
          (err, user) => {
            if (err) {
              res.json(401, {
                message: err
              });
              return;
            } else {
              console.log('RESPONSE ' + err);
              res.json(200, {
                message: user
              });
            }
          });
      };
      if (req.decoded.role === 'Administrator') {
        const id = req.params.id;
        deleteMe(id.trim());
      } else if (req.decoded._id === req.params.id) {
        const id1 = req.decoded._id;
        deleteMe(id1.trim());
      } else {
        res.json(403, {
          message: 'Not allowed to delete this user.'
        });
      }
    }
  };
})();
