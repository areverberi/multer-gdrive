# multer-gdrive

multer storage engine for google drive

## Installation

```sh
npm install --save multer-gdrive
```

## Usage

```javascript
var google = require('googleapis')
var express = require('express')
var multer = require('multer')
var multerS3 = require('multer-gdrive')

var app = express()
var jwtClient = new google.auth.JWT({/*...*/});

var upload = multer({
  storage: multerS3(jwtClient)
})

app.post('/upload', upload.array('photos', 3), function(req, res, next) {
  res.send('Successfully uploaded ' + req.files.length + ' files!')
})
```

### File information

`multer-gdrive` appends to the uploaded file the following information

Key | Description
--- | ---
`googleId` | file id on google drive
