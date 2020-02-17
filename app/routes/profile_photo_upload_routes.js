// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for profilephotouploads
const ProfilePhotoUpload = require('../models/profile_photo_upload')
// require multer into file
const multer = require('multer')
// invoke multer function and store in "multer_uploads" folder
const profilephotoupload = multer({ dest: 'multer_uploads/' })
// require promise for AWS
const promiseS3ProfilePhotoUpload = require('../../lib/promiseS3ProfilePhotoUpload')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /profilephotouploads
router.get('/profilephotouploads', requireToken, (req, res, next) => {
  ProfilePhotoUpload.find({ owner: req.user.id })
    .then(videos => {
      // `videos` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return videos.map(video => video.toObject())
    })
    // respond with status 200 and JSON of the videos
    .then(videos => res.status(200).json({ videos: videos }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /profilephotouploads/5a7db6c74d55bc51bdf39793
router.get('/profilephotouploads/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  ProfilePhotoUpload.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful respond with 200 and "video" JSON
    .then(video => {
      // throw an error if current user doesn't own `videos`
      requireOwnership(req, video)
      res.status(200).json({ video: video.toObject() })
    })
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /profilephotouploads
router.post('/profilephotouploads', requireToken, profilephotoupload.single('image'), (req, res, next) => {
  // set owner of new video to be current user
  // req.body.profilephotoupload.owner = req.user._id
  // console.log('This is req.body.profilePhoto: ', req.body.profilePhoto)

  promiseS3ProfilePhotoUpload(req)
    .then(awsResponse => {
      return ProfilePhotoUpload.create({
        url: awsResponse.Location,
        owner: req.user._id
      })
    })
    // respond to succesful `create` with status 201 and JSON of new "video"
    .then(profilephotoupload => {
      res.status(201).json({ profilephotoupload: profilephotoupload.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /profilephotouploads/5a7db6c74d55bc51bdf39793
router.patch('/profilephotouploads/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.video.owner

  ProfilePhotoUpload.findById(req.params.id)
    .then(handle404)
    .then(video => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, video)

      // pass the result of Mongoose's `.update` to the next `.then`
      return video.update(req.body.video)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /profilephotouploads/5a7db6c74d55bc51bdf39793
router.delete('/profilephotouploads/:id', requireToken, (req, res, next) => {
  ProfilePhotoUpload.findById(req.params.id)
    .then(handle404)
    .then(video => {
      // throw an error if current user doesn't own `video`
      requireOwnership(req, video)
      // delete the video ONLY IF the above didn't throw
      video.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
