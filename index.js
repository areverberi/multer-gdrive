var google = require('googleapis'),
  uuid = require('uuid'),
  concat = require('concat-stream');


function DriveStorage(opts, preproc) {
  this.drive = google.drive({ version : 'v3', auth : opts});
  this.preproc = preproc;
}

DriveStorage.prototype._handleFile = function(req, file, cb) {
  var stream = file.stream;
  //this turns the stream to a buffer
  var concatStream = concat(this.preproc);
  if(typeof this.preproc === 'function') {
    stream = stream.pipe(concatStream);
  }
  this.drive.files.create({
    resource: {
      name: file.originalname,
      mimeType: file.mimetype,
    },
    media: {
      mimeType: file.mimetype,
      body: stream,
    }
  }, function(err, response) {
    if(err) {
      console.log(err);
      return cb(err, null);
    }
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

module.exports = function (opts, preproc) {
  return new DriveStorage(opts, preproc);
};
