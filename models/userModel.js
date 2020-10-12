const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
        validate: {
            //Validation method only works on create / save.
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match',
        },
    },
});

//Use pre-save hook for encryption.

userSchema.pre('save', async function (next) {
    //Check if user has only modified password. If user has not modified password, next().
    if (!this.isModified('password')) return next();

    //Use bcrypt to hash password--(hash() is asynchronous) enter the password and 'cost'. Increase of Cost = increase of time needed to hash password. Good Standard is 12.
    this.password = await bcrypt.hash(this.password, 12);
    //Set passwordConfirm to undefined, as it is not needed after initial confirmation of two passwords-- We don't want this persisted to database.
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
