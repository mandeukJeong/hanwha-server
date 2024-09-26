const express = require('express');
const voteController = require('../controllers/voteController');

const router = express.Router();

router.get('/', voteController.getVoteList);
router.post('/complete', voteController.updateVoteList);
router.get('/done', voteController.isUserVoted);

module.exports = router;
