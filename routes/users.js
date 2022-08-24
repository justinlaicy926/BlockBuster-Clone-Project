/*
    The routes handling for users, requires models for users.
    Allows users to submit, get, update, or delete a desired users.
*/
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('loadash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
//joi-password-complexity

//user info sent thru json web token for security reasons
router.get('/me', auth, async (req, res) => {
    //do not sent password back to the user
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    //make sure the user information is valid
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    //make sure this user has not already been registered
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');

    //only gets the desired properties
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    //get a new object with only the selected properties, no passwords
    //send a header of authentication token
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;