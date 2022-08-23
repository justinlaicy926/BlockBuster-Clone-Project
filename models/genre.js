/*
  The model for genre objects. 
  Exports a genre object, a genre schema, and a function that validates a genre object.
*/

const Joi = require('joi');
const mongoose = require('mongoose');

const Genre = mongoose.model('Genre', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
}));

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  }
});

exports.Genre = Genre; 
exports.validate = validateGenre;
exports.genreSchema = genreSchema;