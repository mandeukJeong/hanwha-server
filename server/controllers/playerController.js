const dotenv = require('dotenv');
const playerService = require('../services/playerService');

dotenv.config();

module.exports = {
  getPlayerProfile: async (req, res) => {
    try {
      if (!req.body.posCd) {
        return res
          .status(400)
          .json({ message: '포지션 코드가 전송되지 않았습니다.' });
      }

      const playerList = await playerService.getPlayerProfile(req.body.posCd);
      return res.status(200).send(playerList);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};
