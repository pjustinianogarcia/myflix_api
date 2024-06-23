//import mongoose, bcrypt modules
const mongoose = require('mongoose');



  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Birthdate: Date,
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

  
   

  //export models
 
  let User = mongoose.model('User', userSchema);

  
  module.exports.User = User;