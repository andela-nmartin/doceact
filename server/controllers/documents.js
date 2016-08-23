(() => {
  'use strict';
  // get the required models and db connection
  const moment = require('moment');
  const Document = require('../models/documents');

  module.exports = {
    // get document by id
    get: (req, res) => {
      var id = req.params.id;
      Document.find({
        _id: id
      }, (err, documents) => {
        if (err) {
          res.send(err);
          return;
        }
        res.send(documents);
      });
    },

    // to get the mongo cluster of all the documents stored
    getAll: (req, res) => {
      Document.find({}, (err, documents) => {
        if (err) {
          res.send(err);
          return;
        }
        res.json(documents);
      });
    },

    create: (req, res) => {
      var document = new Document({
        ownerId: req.decoded._id,
        title: req.body.title,
        content: req.body.content
      });
      document.save((err) => {
        if (err) {
          res.send(err);
          return;
        } else {
          res.json({
            document: document,
            success: true,
            message: 'Document has been created!'
          });
        }
      });
    },

    // update document by id
    update: (req, res) => {
      var id = req.params.id;
      Document.findById(req.params.id).exec((err, document) => {
        if (err) {
          res.status(500).send({
            message: 'There was a problem deleting your document.'
          });
        } else {
          if (!document) {
            res.status(404).send({
              message: 'No document found.'
            });
          } else {
            if (req.decoded._id !== document.ownerId &&
              req.decoded.role === 'User') {
              // send 403 status and forbidden message
              res.status(403).send({
                message: 'Forbidden to update this document.'
              });
            } else {
              // delete or update
              Document.findOneAndUpdate({
                  _id: id
                }, {
                  title: req.body.title,
                  content: req.body.content
                }, {
                  title: req.body.title,
                  content: req.body.content
                },
                (err) => {
                  if (err) {
                    res.send(err);
                    return;
                  } else {
                    res.json({
                      success: true,
                      message: 'Successfully updated Document!'
                    });
                  }
                });
            }
          }
        }
      });
    },

    // delete document by id
    delete: (req, res) => {
      Document.findById(req.params.id).exec((err, document) => {
        if (err) {
          res.status(500).send({
            message: 'There was a problem deleting your document.'
          });
        } else {
          if (!document) {
            res.status(404).send({
              message: 'No document found.'
            });
          } else {
            console.log(req.decoded, document.ownerId);
            if (req.decoded._id !== String(document.ownerId) &&
              req.decoded.role === 'User') {
              // send 403 status and forbidden message
              res.status(403).send({
                message: 'Forbidden to delete this document.'
              });
            } else {
              // delete or update
              Document.findOneAndRemove({
                _id: req.params.id
              }).exec((err, document) => {
                if (err) {
                  return err;
                } else {
                  res.status(200).json({
                    message: document
                  });
                }
              });
            }
          }
        }
      });
    },

    // to get the mongo cluster of all the documents filtered by 'User' role
    getAllDocumentsByRoleUser: (req, res) => {
      Document.find({})
        .populate('ownerId')
        .limit(4)
        .sort([
          ['dateCreated', 'descending']
        ])
        .exec((err, documents) => {
          if (err) {
            res.send(err);
            return;
          }
          const filtered = documents.map(
            (obj) => {
              if (obj.ownerId.role === 'User') {
                return obj;
              }
            });
          for (var i = 0; i < filtered.length; i++) {
            if (!filtered[i]) {
              filtered.splice(i, 1);
            }
          }
          res.json(filtered);
        });
    },

    // cluster of all the documents filtered by 'Administrator' role
    getAllDocumentsByRoleAdministrator: (req, res) => {
      Document.find({})
        .populate('ownerId')
        .limit(4)
        .sort([
          ['dateCreated', 'descending']
        ])
        .exec((err, documents) => {
          if (err) {
            res.send(err);
            return;
          }
          const filtered = documents.map(
            (obj) => {
              if (obj.ownerId.role === 'Administrator') {
                return obj;
              }
            });
          for (var i = 0; i < filtered.length; i++) {
            if (!filtered[i]) {
              filtered.splice(i, 1);
            }
          }
          res.json(filtered);
        });
    },

    // to get the mongo cluster of all the documents filtered by date
    getAllDocumentsByDate: (req, res) => {
      Document.find({
          dateCreated: {
            $gt: moment().subtract(1, 'day'),
            $lt: moment().add(1, 'day')
          }
        })
        .limit(4)
        .exec((err, documents) => {
          if (err) {
            res.send(err);
            return;
          }
          res.json(documents);
        });
    },

    getAllDocumentsParticularUser: (req, res) => {
      const id = req.param('id');
      Document.find({
        ownerId: id
      }, (err, documents) => {
        if (err) {
          res.send(err);
          return;
        }
        res.json(documents);
      });
    }
  };
})();
