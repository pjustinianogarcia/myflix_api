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
  
  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Birthdate: Date,
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

  
   

  //export models
  let Director = mongoose.model('Director', directorSchema);
  let Genre = mongoose.model('Genre', genreSchema);
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);

  module.exports.Director = Director;
  module.exports.Genre = Genre;
  module.exports.Movie = Movie;
  module.exports.User = User;