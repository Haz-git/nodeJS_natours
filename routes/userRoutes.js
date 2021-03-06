const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//Signup/Login routes:

router.post('/signup', authController.signup);
router.post('/login', authController.login);

//Reset Password Routes:
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//CRUD routes:

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;