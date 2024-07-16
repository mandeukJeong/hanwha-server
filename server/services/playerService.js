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
  getPlayerList: async (posCd) => {
    try {
      const projection = { pCd: 1, pNm: 1, pEn: 1, img: 1, backNo: 1 };
      // 1: 투수, 2: 포수, 3: 내야수, 4: 외야수
      return await db
        .collection('players')
        .find({ posCd }, { projection })
        .sort({ backNo: 1 })
        .toArray();
    } catch (e) {
      throw e;
    }
  },

  getPlayerProfile: async (pCd) => {
    try {
      return await db.collection('players').findOne({ pCd });
    } catch (e) {
      throw e;
    }
  },
};
