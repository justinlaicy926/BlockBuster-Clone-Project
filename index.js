/* 
    The main application file.
*/

require('winston-mongodb');
const winston = require('winston');
require('express-async-errors');
const error = require('./middleware/error');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

//catches exceptions outside express
process.on('uncaughtException', (ex)=>{
    winston.error(ex.message, ex);
    //exits with a non-zero code
    process.exit(1);
});

//catches unhandled rejections
process.on('unhandledRejection', (ex)=>{
    winston.error(ex.message, ex);
    //exits with a non-zero code
    process.exit(1);
});

//only catches errors thrown in the express pipeline
winston.add(winston.transport.defaultMaxListeners, {
    filename: 'logfile.log'
});
//MogoDB is better for queryings
winston.add(winston.transport.MongoDB, {
    db: 'mongodb://localhost/bb',
    //logs only errors
    level: 'error'
});

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/blockbuster')
    .then(()=> console.log('Connection successful'))
    .catch(err=>console.error('Cannot connect to MongoDB'))

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

//error handling
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));