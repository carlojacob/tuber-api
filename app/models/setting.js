const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
  autoplay: {
    checked: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  loop: {
    checked: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Settings', settingSchema)
