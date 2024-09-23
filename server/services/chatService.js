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
        member: [],
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
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const parseDate = (dateStr) => {
        const [datePart, timePart] = dateStr.split(' ');
        const [year, month, day] = datePart.split('.').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
      };

      const sortedChatRooms = chatRooms.sort((a, b) => {
        const dateA = parseDate(a.startDate);
        const dateB = parseDate(b.startDate);

        const isTodayA = dateA >= today && dateA < tomorrow;
        const isTodayB = dateB >= today && dateB < tomorrow;

        if (isTodayA && !isTodayB) return -1;
        if (!isTodayA && isTodayB) return 1;
        if (isTodayA && isTodayB) return dateA - dateB;

        if (dateA >= tomorrow && dateB >= tomorrow) return dateA - dateB;

        return dateB - dateA;
      });

      return sortedChatRooms;
    } catch (e) {
      throw e;
    }
  },

  getOneChatRoom: async (id) => {
    try {
      return await db.collection('chatroom').findOne({ _id: new ObjectId(id) });
    } catch (e) {
      throw e;
    }
  },

  increaseMember: async (roomId, userId) => {
    try {
      const isChatRoom = await db
        .collection('chatroom')
        .findOne({ _id: new ObjectId(roomId) });

      if (!isChatRoom) {
        const error = new Error('채팅방이 존재하지 않습니다.');
        error.code = 404;
        throw error;
      }

      return await db
        .collection('chatroom')
        .updateOne(
          { _id: new ObjectId(roomId) },
          { $addToSet: { member: userId } }
        );
    } catch (e) {
      throw e;
    }
  },

  removeMember: async (roomId, userId) => {
    try {
      const isChatRoom = await db
        .collection('chatroom')
        .findOne({ _id: new ObjectId(roomId) });

      if (!isChatRoom) {
        const error = new Error('채팅방이 존재하지 않습니다.');
        error.code = 404;
        throw error;
      }

      return await db
        .collection('chatroom')
        .updateOne(
          { _id: new ObjectId(roomId) },
          { $pull: { member: userId } }
        );
    } catch (e) {
      throw e;
    }
  },
};
