const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User =  new Schema({
  username: {
    type: String,
    required: true
    // match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  recipes: [
    {
    name: {
      type: String,
      required: true,
    },
    playlistRef: {
      type: String,
      default: "crickets..."
    },
    
  }
  ]
})


module.exports = mongoose.model('User', User)