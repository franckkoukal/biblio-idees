const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();


//chargement du model USER
require('../models/User');
const User = mongoose.model('users');

//User login route
router.get('/login', (req, res) =>{
  res.render('users/login')
});
  
//User register route
router.get('/register', (req, res) =>{
  res.render('users/register')
  });

//login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

//Register form POST
router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({text:'Les mots de passe ne sont pas identiques'});
  }

  if(req.body.password.length < 4){
    errors.push({text:'Le mot de passe doit contenir au moins 4 caractères'});
  }

  if(errors.length > 0){
    res.render('users/register', {
        errors: errors,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
      });
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if(user) {
          req.flash('error_msg', 'L\'email a déjà été enregistré');
          res.redirect('/users/register');
        } else {
          const newUser = new User ({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
  
          bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(newUser.password, salt, (err, hash) => {
             if(err)throw err;
            newUser.password = hash;
            newUser.save()
              .then( user => {
                req.flash('success_msg', 'Vous êtes enregistré, vous pouvez-vous connecter');
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
                return;
              });
            });
        });
      }
    });
  }
});

//logout User
router.get('/logout', (req, res) =>{
  req.logout();
  req.flash('success_msg', 'Vous êtes déconnecté');
  res.redirect('/users/login')
});

module.exports = router;