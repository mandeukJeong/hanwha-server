const { ObjectId } = require('mongodb');
const connectDB = require('../database/database');

let db;
connectDB
  .then((client) => {
    console.log('MongoDB 연결 성공');
    db = client.db('hanwha');
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = {
  getTeamInfo: async () => {
    try {
      return await db.collection('team').find().toArray();
    } catch (e) {
      throw e;
    }
  },

  makeChatRoom: async (ourTeam, vsTeam, startDate) => {
    try {
      return await db.collection('chatroom').insertOne({
        ourTeam,
        vsTeam,
        startDate,
        connected: 0,
      });
    } catch (e) {
      throw e;
    }
  },

  getChatRoomList: async () => {
    try {
      const chatRooms = await db.collection('chatroom').find().toArray();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const parseDate = (dateStr) => {
        const [datePart, timePart] = dateStr.split(' ');
        const [year, month, day] = datePart.split('.').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
      };

      const sortedChatRooms = chatRooms.sort((a, b) => {
        const dateA = parseDate(a.startDate);
        const dateB = parseDate(b.startDate);

        const diffA = dateA - today;
        const diffB = dateB - today;

        if (diffA >= 0 && diffB >= 0) {
          return diffA - diffB;
        } else if (diffA < 0 && diffB < 0) {
          return diffB - diffA;
        } else {
          return diffA - diffB;
        }
      });

      return sortedChatRooms;
    } catch (e) {
      throw e;
    }
  },
};
