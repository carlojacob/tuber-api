const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
  artist: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  album: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Video', videoSchema)
