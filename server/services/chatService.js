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
};
