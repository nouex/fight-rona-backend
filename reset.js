const ACCESS_KEY = process.env.ACCESS_KEY
const SECRET_KEY = process.env.SECRET_KEY

require("assert").notEqual(ACCESS_KEY, undefined, "ACCESS_KEY is not set")
require("assert").notEqual(SECRET_KEY, undefined, "SECRET_KEY is not set")

var AWS = require('aws-sdk');

// Create a bucket and upload something into it
var bucketName = 'fight-rona'
var keyName = 'click-count.json';

var params = {Bucket: bucketName, Key: keyName};

// Create an S3 client
var s3 = new AWS.S3(
  {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY
  }
);

params.Body = JSON.stringify({count: 0})
s3.putObject(params, function(err, data) {
  if (err)
    console.log(err)
  else
    console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
});
