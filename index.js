//import mongoose
const mongoose = require('mongoose');
//import exported models
const Models = require('./models.js');

//URI
 mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

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
//const { check, validationResult } = require('express-validator');



//parse request with json
app.use(express.json());





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
app.get("/movies", (req, res) => {
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
app.get("/movies/:Title", async (req, res) => {
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
app.get("/genres/:Name", async (req, res) => {
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
app.get("/directors/:Name", (req, res) => {
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
app.get('/users', async (req, res) => {
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
app.get('/users/:Username', async (req, res) => {
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
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });
                 

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
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
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
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
app.put('/users/:Username', async (req, res) => {
    
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
app.delete('/users/:Username', async (req, res) => {
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