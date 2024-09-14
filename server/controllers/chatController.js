const dotenv = require('dotenv');
const chatService = require('../services/chatService');

dotenv.config();

module.exports = {
  getTeamInfo: async (req, res) => {
    try {
      const teamList = await chatService.getTeamInfo();

      return res.status(200).send(teamList);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};
