/*
  The model for movie objects. 
  Exports a movie schema, and a function that validates a movie object.
*/

const Joi = require('joi');
const func = require('joi/lib/types/func');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');

const Movie = mongoose.Model('Movies', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentralRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}));

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentralRate: Joi.number().min(0).required()
    };

    return Joi.validate(movie, schema);
}

exports.Movie = Movie; 
exports.validate = validateMovie;