//import mongoose, bcrypt modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    Genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
    Director: { type: mongoose.Schema.Types.ObjectId, ref: 'Director' },
    ImagePath: String,
    Featured: Boolean
  });
  
  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Birthdate: Date,
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

  //hashing
  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
   

  //export models
  let Director = mongoose.model('Director', directorSchema);
  let Genre = mongoose.model('Genre', genreSchema);
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);

  module.exports.Director = Director;
  module.exports.Genre = Genre;
  module.exports.Movie = Movie;
  module.exports.User = User;