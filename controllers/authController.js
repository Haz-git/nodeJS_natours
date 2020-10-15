const {
    promisify
} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'Success!',
        token,
        data: {
            user: newUser,
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    //1. check is email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide an email and a password!', 400));
    }
    //2. Check if user exists && password is correct
    const user = await User.findOne({
        email
    }).select('+password');

    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or password!', 401));
    }
    //3. If everything is OK, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'Success!',
        token,
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    //1) Get Token and Check Existence
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError(`You are not logged in! Please log in to access this feature.`, 401));
    }

    //2) Verification Token
    // We are using the 'utils' built-in library to make jwt.verify() return a promise.
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) Check if User still exists

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    //4)Check if user changed password after the JWT was issued
    //Create another instance method -- alot of code, so put in model,
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError(`User recently changed password, please log in again.`, 401));
    }
    //next() gives access to protected route.
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles = []

        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        };

        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1. Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no registered User under the requested email address.', 404));
    }
    //2. Generate the random reset token -- This will be an instance method because it has to do more with user data (model)

    //3. Sent it to user's email
});

exports.resetPassword = (req, res, next) => {
    
}