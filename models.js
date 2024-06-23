//import mongoose, bcrypt modules
const mongoose = require('mongoose');


//define schemas
let genreSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Description: String
});

  


  
   

  //export models
  
  let User = mongoose.model('User', userSchema);

  module.exports.User = User;