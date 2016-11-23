var google = require('googleapis'),
  uuid = require('uuid'),
  Promise = require('bluebird');


function DriveStorage(opts, preproc) {
  this.drive = google.drive({ version : 'v3', auth : opts});
  this.preproc = preproc;
}

DriveStorage.prototype._handleFile = function(req, file, cb) {
  var stream = file.stream;
  var self = this;
  if(typeof this.preproc === 'function') {
    stream = this.preproc(stream);
  } else {
    stream = new Promise(function(resolve) {
      return resolve(stream);
    });
  }
  stream
    .then(function(_stream) {
      self.drive.files.create({
        resource: {
          name: file.originalname,
          mimeType: file.mimetype,
        },
        media: {
          mimeType: file.mimetype,
          body: _stream,
        }
      }, function(err, response) {
        if(err) {
          console.log(err);
          return cb(err, null);
        }
        return cb(err, {
          googleId: response.id
        });
      });
    })
    .catch(function(err) {
      console.error('caught error', err);
    });
};

DriveStorage.prototype._removeFile = function(req, file, cb) {
  this.drive.files.delete({
    fileId: file.googleId,
  }, cb);
};

module.exports = function (opts, preproc) {
  return new DriveStorage(opts, preproc);
};
