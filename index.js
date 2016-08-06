var google = require('googleapis'),
  tmpfile = require('tempfile');


function DriveStorage(opts) {
  this.drive = google.drive({ version : 'v3', auth : opts});
}

DriveStorage.prototype._handleFile = function(req, file, cb) {
  this.drive.files.create({
    resource: {
      name: tmpfile(),
      mimeType: file.mimetype,
    },
    media: {
      mimeType: file.mimetype,
      body: file.stream,
    }
  }, function(err, response) {
    cb(err, {
      googleId: response.id
    });
  });
};

DriveStorage.prototype._removeFile = function(req, file, cb) {
  this.drive.files.delete({
    fileId: file.googleId,
  }, cb);
};

module.exports = function (opts) {
  return new DriveStorage(opts);
};
