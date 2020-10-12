const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign({ id: newUser.__id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
        status: 'Success!',
        token,
        data: {
            user: newUser,
        },
    });
});

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    //1. check is email and password exist
    if (!email || !password) {
        next(new AppError('Please provide an email and a password!', 400));
    }
    //2. Check if user exists && password is correct

    //3. If everything is OK, send token to client
    const token = ``;
    res.status(200).json({
        status: 'Success!',
        token,
    });
};
