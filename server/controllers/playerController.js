const dotenv = require('dotenv');
const playerService = require('../services/playerService');

dotenv.config();

module.exports = {
  getPlayerList: async (req, res) => {
    try {
      if (!req.query.posCd) {
        return res
          .status(400)
          .json({ message: '포지션 코드가 전송되지 않았습니다.' });
      }

      const playerList = await playerService.getPlayerList(
        Number(req.query.posCd)
      );
      return res.status(200).send(playerList);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  getPlayerProfile: async (req, res) => {
    try {
      if (!req.params.pCd) {
        return res
          .status(400)
          .json({ message: '선수 코드가 전송되지 않았습니다.' });
      }

      const playerInfo = await playerService.getPlayerProfile(
        Number(req.params.pCd)
      );
      return res.status(200).send(playerInfo);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  getPlayerScore: async (req, res) => {
    try {
      if (!req.query.pCd && !req.query.posCd) {
        return res.status(400).json({
          message: '선수 코드 또는 포지션 코드가 전송되지 않았습니다.',
        });
      }

      const playerScore = await playerService.getPlayerScore(
        Number(req.query.pCd),
        Number(req.query.posCd)
      );

      return res.status(200).send(playerScore);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};
