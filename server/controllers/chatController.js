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

  getChatRoomList: async (req, res) => {
    try {
      const chatList = await chatService.getChatRoomList();

      return res.status(200).send(chatList);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  getOneChatRoom: async (req, res) => {
    try {
      if (!req.query.id) {
        return res
          .status(400)
          .json({ message: '채팅방 아이디가 전송되지 않았습니다.' });
      }

      const chatRoom = await chatService.getOneChatRoom(req.query.id);

      return res.status(200).send(chatRoom);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  increaseMember: async (req, res) => {
    try {
      if (!req.query.id) {
        return res
          .status(400)
          .json({ message: '채팅방 아이디가 전송되지 않았습니다.' });
      }

      await chatService.increaseMember(req.query.id, req.cookies.user);

      return res.status(200).send('멤버 업데이트 성공');
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  removeMember: async (req, res) => {
    try {
      if (!req.query.id) {
        return res
          .status(400)
          .json({ message: '채팅방 아이디가 전송되지 않았습니다.' });
      }

      await chatService.removeMember(req.query.id, req.cookies.user);

      return res.status(200).send('멤버 pop 성공');
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  getChatMessage: async (req, res) => {
    try {
      if (!req.query.id) {
        return res
          .status(400)
          .json({ message: '채팅방 아이디가 전송되지 않았습니다.' });
      }

      const chatMessage = await chatService.getChatMessage(req.query.id);

      return res.status(200).send(chatMessage);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};
