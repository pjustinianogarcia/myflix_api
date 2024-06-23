//import mongoose, bcrypt modules
const mongoose = require('mongoose');


//define schemas
let genreSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Description: String
});

let directorSchema = mongoose.Schema({
  Name: { type: String, required: true },
      Bio: String,
      Birth: Date
});


let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
   
  });
  


  
   

  //export models
  let Director = mongoose.model('Director', directorSchema);
  let Genre = mongoose.model('Genre', genreSchema);
  let Movie = mongoose.model('Movie', movieSchema);


  module.exports.Director = Director;
  module.exports.Genre = Genre;
  module.exports.Movie = Movie;
  