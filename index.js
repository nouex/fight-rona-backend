
const ACCESS_KEY = process.env.ACCESS_KEY
const SECRET_KEY = process.env.SECRET_KEY

require("assert").notEqual(ACCESS_KEY, undefined, "ACCESS_KEY is not set")
require("assert").notEqual(SECRET_KEY, undefined, "SECRET_KEY is not set")

const https = require('https');
const http = require('http');
const fs = require("fs")

const AWS = require('aws-sdk');
const express = require('express')
const cors = require("cors")
const app = express()

const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
}

const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY
  });

app.use(cors())

app.get('/', (req, res) => {
  const clicks = +req.query.clicks

  if (isNaN(clicks)) {
    res.send("Error: clicks should be a number, received " + req.query.clicks)
    return
  }

  const bucketName = 'fight-rona'
  const keyName = 'click-count.json';
  const params = {Bucket: bucketName, Key: keyName};

  s3.getObject(params, function(err, data) {
    if (err) {
      console.log("received error", err)
      res.send(err)
    } else {
      const json = JSON.parse(data.Body.toString('utf-8'));
      console.log(`Adding --${clicks}-- to --${json.count}--`)
      json.count += clicks

      // serialize
      params.Body = JSON.stringify(json)

      s3.putObject(params, function(err, data) {
        if (err) {
          console.log(err)
          res.send("Error")
        }
        else {
          console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
          res.send("Success")
        }
      });
    }
  });
})

http.createServer(app).listen(80, () => console.log(`HTTP listening...`))
https.createServer(options, app).listen(443, () => console.log(`HTTPS listening...`))
