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

  makeChatRoom: async (req, res) => {
    try {
      console.log(req.body);
      if (!req.body.ourTeam || !req.body.vsTeam || !req.body.startDate) {
        return res
          .status(400)
          .json({ message: '팀, 상대팀, 시작 날짜 정보를 전송해주세요.' });
      }

      await chatService.makeChatRoom(
        req.body.ourTeam,
        req.body.vsTeam,
        req.body.startDate
      );

      return res.status(200).send('채팅방 생성 성공');
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};