'use strict'

require('dotenv').config()

const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const fs = require('fs')
const mime = require('mime-types')

const promiseS3ProfilePhotoUpload = req => {
  return new Promise((resolve, reject) => {
    const filePath = req.file.path
    // const filePathArray = filePath.split('/')
    // const filename = filePathArray[filePathArray.length - 1]
    // const keyname = req.file.originalname.split('.')[0]

    // const fileType = mime.lookup(filePath)
    const extension = mime.extension(req.file.mimetype)
    const fileStream = fs.createReadStream(filePath)

    const params = {
      Bucket: process.env.AWS_BUCKETNAME,
      Key: `${req.file.filename}.${extension}`,
      Body: fileStream,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
      // Key: `${Date.now().toString()} ${keyname}.${extension}`,
      // ContentType: mime.contentType(fileType),
    }
    // console.log('process.env: ', process.env)
    // console.log('params: ', params)

    s3.upload(params, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = promiseS3ProfilePhotoUpload
