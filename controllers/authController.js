const {
    promisify
} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

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

    const resetToken = user.createPasswordResetToken() // This function modifies the data, but doesn't save the data:
    await user.save({ validateBeforeSave: false });

    //3. Sent it to user's email--NOT IMPLEMENTED YET!
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \nIf you didn't forget your password, please ignore this email!`;

    try {

        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        })

        res.status(200).json({
            status: 'Successful',
            message: 'Token sent to email!'
        })
    } catch (err) {
        //If something goes wrong, destroy the tokens and save it.
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later.',500));
    }
});

exports.resetPassword = catchAsync(async(req, res, next) => {
    //1. Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    //find the user with the token and make sure that the token is not expired:
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gte: Date.now() }
    });

    //2. If the token has not expired, and there is user, set the new password.active
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400))
    }

    //3. Update changedPasswordAt property for the user

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    //Remember to save after modification:
    await user.save();

    //4. Log the user in, and send JWT.
    const token = signToken(user._id);

    res.status(200).json({
        status: 'Success!',
        message: 'Your password has been changed.',
        token,
    });
});