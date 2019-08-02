/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/newsletters              ->  index
 * POST    /api/newsletters              ->  create
 * GET     /api/newsletters/:id          ->  show
 * PUT     /api/newsletters/:id          ->  upsert
 * PATCH   /api/newsletters/:id          ->  patch
 * DELETE  /api/newsletters/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {Newsletter} from '../../sqldb';
import multer from 'multer';


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Newsletters
export function index(req, res) {
  return Newsletter.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Newsletter from the DB
export function show(req, res) {
  return Newsletter.find({
    where: {
      NewsletterId: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Newsletter in the DB
export function create(req, res) {

  //console.log(req, res);
  var upload = multer({
    storage: configureStorage()
  }).single('file')


  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      res.json({ errorCode: 1, errorDesc: err });
      return;
    }

    var file = req.file;
    var year = req.body.year;
    var month = req.body.month;
    var newsletterToSave = {Year: parseInt(year), Month:parseInt(month)}
    newsletterToSave.FileUrl = `assets/documents/uploads/newsletters/${file.filename}`;
    console.log('newsletterToSave', newsletterToSave);

    return Newsletter.create(newsletterToSave)
      .then(respondWithResult(res, 201))
      .catch(handleError(res));
    });
}

// Upserts the given Newsletter in the DB at the specified ID
export function upsert(req, res) {
  if(req.body.NewsletterId) {
    Reflect.deleteProperty(req.body, 'NewsletterId');
  }

  return Newsletter.upsert(req.body, {
    where: {
      NewsletterId: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Newsletter in the DB
export function patch(req, res) {
  if(req.body.newsletterId) {
    Reflect.deleteProperty(req.body, 'NewsletterId');
  }
  return Newsletter.find({
    where: {
      NewsletterId: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a newsletter from the DB
export function destroy(req, res) {
  return Newsletter.find({
    where: {
      NewsletterId: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

function configureStorage() {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './client/assets/documents/');
    },
    filename: function (req, file, cb) {
      file.timestamp = Date.now();
      var name = file.originalname.replace(/[^a-zA-Z0-9]/, '');
      var format = file.originalname.split('.')[file.originalname.split('.').length - 1];
      cb(null, `${file.timestamp}-${name}.${format}`);
    }
  });
}