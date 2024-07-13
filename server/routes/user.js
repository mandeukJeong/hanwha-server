const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/refresh', userController.refreshUser);
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  userController.getUser
);
router.post('/logout', userController.logout);
router.post('/email', userController.sendEmail);
router.post('/check', userController.checkAuth);
router.post('/password', userController.changePassword);

module.exports = router;
