const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//load Helper
const {ensureAuthenticated}  = require ('../helpers/auth');

//chargement du model IDEA
require('../models/Idea');
const Idea = mongoose.model('ideas');

//ideas index page
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({user:req.user.id})
  .sort({date:'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas: ideas
    })
  })
});

//ADD form route
router.get('/add', ensureAuthenticated, (req, res) =>{
  res.render('ideas/add');
});

//edit idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) =>{
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea =>{
    if(idea.user != req.user.id) {
      req.flash('error_msg', 'Aucune autorisation');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea:idea
      });
    }
  });
});

router.post('/', ensureAuthenticated, (req, res) =>{
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Titrez votre idée'});
  }

  if(!req.body.details){
    errors.push({text:'Dites-en un peu plus dans la section \'Détails\''});
  }

  if(errors.length > 0){
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
      })
    } else {
      const newUser = {
        title:req.body.title,
        details : req.body.details,
        user: req.user.id
      }
         new Idea(newUser)
         .save()
         .then(idea => {
          req.flash('success_msg', 'Votre idée à été ajouté !');
           res.redirect('./ideas');
         }) 
       }
});

//edit form process
router.put('/:id', ensureAuthenticated,  (req, res) => {
  Idea.findOne({
    _id:req.params.id
  })
  .then(idea => {
    //new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then( idea => {
      req.flash('success_msg', 'Votre idée à été mis à jour !');
      res.redirect('/ideas');
    })
  });
});

//Delete ideas
router.delete('/:id', ensureAuthenticated, (req, res) => {
 Idea.deleteOne({ _id: req.params.id})
  .then(() =>{
    req.flash('success_msg', 'Votre idée à été effacé!');
    res.redirect('/ideas');
  })
})

module.exports = router;