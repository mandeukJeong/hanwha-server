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
  getPlayerProfile: async (posCd) => {
    try {
      // 1: 투수, 2: 포수, 3: 내야수, 4: 외야수
      return await db.collection('players').find({ posCd: posCd }).toArray();
    } catch (e) {
      throw e;
    }
  },
};
