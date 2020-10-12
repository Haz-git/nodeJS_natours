const mongoose = require('mongoose');
const validator = require('validator');

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A new user must have a name!'],
        unique: true,
        minlength: [3, 'Please create a username over three characters!'],
    },
    email: {
        type: String,
        required: [true, 'Please enter an email address!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email address!'],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: [6, 'Please enter a password over 6 characters'],
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
    }
});

const User = mongoose.model('User', userModel);

module.exports = User;