const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  userController.getUser
);

module.exports = router;
