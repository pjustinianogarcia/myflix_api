//import mongoose
const mongoose = require('mongoose');
//import exported models
const Models = require('./models.js');

//URI
 //mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

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