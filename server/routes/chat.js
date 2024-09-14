const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/team', chatController.getTeamInfo);

module.exports = router;
