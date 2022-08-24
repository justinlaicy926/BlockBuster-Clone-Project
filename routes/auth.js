const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('loadash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
//joi-password-complexity

router.post('/', async (req, res) => {
    //make sure the user information is valid
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    //make sure this user has not already been registered
    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password.');

    //validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    //no hard-coded private key, should be stored as an environmental variable
    //generateAuthToken method defined in user model
    const token = user.generateAuthToken();

    res.send(token);
});


//validate login information, email and password required
function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
  }

module.exports = router;