const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/team', chatController.getTeamInfo);
router.post('/new', chatController.makeChatRoom);
router.get('/list', chatController.getChatRoomList);

module.exports = router;
