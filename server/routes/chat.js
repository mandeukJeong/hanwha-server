const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/team', chatController.getTeamInfo);
router.post('/new', chatController.makeChatRoom);

module.exports = router;
