//import mongoose
const mongoose = require('mongoose');
//import exported models
const Models = require('./models.js');

//URI
//mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect('mongodb://localhost:27017/myflixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//models
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;



// import express module to file
const express = require('express');
const app = express();
//import morgan1`
const morgan = require('morgan');
//import body-parser
const bodyParser = require('body-parser');
//import uuid
const uuid = require('uuid');



//import express-validator
const { check, validationResult } = require('express-validator');


    

// configure CORS
const cors = require('cors');
let allowedOrigins = ['http://localhost:1234','https://myflixachv-8f7ac3ab3517.herokuapp.com/'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));


//parse request with json
app.use(express.json());


//import auth module
let auth = require('./auth')(app);

//import passport module
const passport = require('passport');
require('./passport');

//log http request using morgan
app.use(morgan('common'));

// static function
app.use(express.static('public'));




// GET requests
//get welcome msg
app.get('/', (req, res) => {
    res.send('Welcome to my movie list!');
});

// get movies list
app.get("/movies", passport.authenticate('jwt', { session: false }), async (req, res) => {
    Movies.find()
    
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error("Error retrieving movies:",err);
            res.status(500).send("Error: " + err);
        });
});





//get movie by title
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), async (req, res) => {
    Movies.findOne({ Title: req.params.Title })
   
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//get genres by name
app.get("/genres/:Name", passport.authenticate('jwt', { session: false }), async (req, res) => {
    Genres.findOne({Name: req.params.Name})
      .then((genre) => {
        res.json(genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });

    //get director by name
app.get("/directors/:Name", passport.authenticate('jwt', { session: false }), async (req, res) => {
    Directors.findOne({Name: req.params.Name})
    .then((director) => {
    res.json(director);
    })
    .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
    });
    });

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//add user
app.post("/users", 
//passport.authenticate('jwt', { session: false }), async (req, res) => {
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
      ], async (req, res) => {
      
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users.create({
                        Username: req.body.Username,
                        Birthdate: req.body.Birthdate,
                        Password: hashedPassword,
                        Email: req.body.Email,
                    })
                    .then((user) => { 
                        res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error creating user: ' + error);
                    })
            }
        })
});


// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) 
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//delete a movie from a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { Username, MovieID } = req.params;

    try {
        // Find the user by username
        const user = await Users.findOneAndUpdate(
            { Username },
            { $pull: { FavoriteMovies: MovieID } },
            { new: true }
        );

        
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error removing movie from favorites');
    }
});

//update users information
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthdate: req.body.Birthdate
        }
    },
        { new: true }) 
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        })
});


// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
})


//listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});