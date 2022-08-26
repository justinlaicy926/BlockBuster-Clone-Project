/*
    The routes handling for genres, requires models for genres.
    Allows users to submit, get, update, or delete a desired genre.
*/

//const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/',  async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

//a protected route, needs a auth middleware function
router.post('/', auth, async (req, res) => { 
  
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({name: req.body.name});
  genre = await genre.save();
  res.send(genre);
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  const genre = await Genre.findByIDAndUpdate(req.param.id, {name: req.body.name}, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIDAndRemove(req.params.id);
  
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.get('/:id', (req, res) => {
  const genre = await Genre.findByID(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

module.exports = router;