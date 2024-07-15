const express = require('express');
const playerController = require('../controllers/playerController');

const router = express.Router();
router.get('/', playerController.getPlayerList);

module.exports = router;
