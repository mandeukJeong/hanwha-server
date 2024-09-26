const dotenv = require('dotenv');
const voteService = require('../services/voteService');

dotenv.config();

module.exports = {
  getVoteList: async (req, res) => {
    try {
      const voteList = await voteService.getVoteList();
      return res.status(200).send(voteList);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  updateVoteList: async (req, res) => {
    try {
      await voteService.updateVoteList(req.body.voteDone, req.cookies.user);
      return res.status(200).send('투표 결과 반영 성공');
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};
