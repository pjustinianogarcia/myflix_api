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

      



//listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});