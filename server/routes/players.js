const express = require('express');
const playerController = require('../controllers/playerController');

const router = express.Router();
router.get('/profile', playerController.getPlayerProfile);

module.exports = router;
