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
};
