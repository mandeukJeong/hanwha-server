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

  isUserVoted: async (req, res) => {
    try {
      const isVoted = await voteService.isUserVoted(req.cookies.user);
      return res.status(200).send(isVoted);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  getVoteRank: async (req, res) => {
    try {
      const rankList = await voteService.getVoteRank();
      return res.status(200).send(rankList);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  getVoteResult: async (req, res) => {
    try {
      if (!req.query.id) {
        return res
          .status(400)
          .json({ message: '투표 글 id가 전송되지 않았습니다.' });
      }
      const resultList = await voteService.getVoteResult(req.query.id);
      return res.status(200).send(resultList);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};
