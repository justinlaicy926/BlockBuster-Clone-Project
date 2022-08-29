const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function(){
    mongoose.connect('mongodb://localhost/blockbuster')
        .then(()=> winston.info('Connection successful'));
}