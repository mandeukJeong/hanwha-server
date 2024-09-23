const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/team', chatController.getTeamInfo);
router.post('/new', chatController.makeChatRoom);
router.get('/list', chatController.getChatRoomList);
router.get('/room', chatController.getOneChatRoom);
router.put('/member', chatController.increaseMember);

module.exports = router;
