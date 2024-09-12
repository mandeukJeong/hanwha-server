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
      const playerProfile = await db.collection('players').findOne({ pCd });

      if (!playerProfile) {
        const error = new Error(
          '해당 선수 코드에 대한 데이터가 존재하지 않습니다.'
        );
        error.code = 404;
        throw error;
      } else {
        return playerProfile;
      }
    } catch (e) {
      throw e;
    }
  },

  getPlayerScore: async (pCd, posCd) => {
    try {
      let projection = null;

      if (posCd === 1) {
        projection = { era: 1, win: 1, lose: 1, sv: 1, so: 1, ip: 1 };
      } else {
        projection = { avg: 1, rbi: 1, h: 1, hr: 1, sb: 1, ops: 1 };
      }

      const playerScore = await db
        .collection('score')
        .findOne({ pCd, posCd }, { projection });

      if (!playerScore) {
        const error = new Error(
          '해당 선수 코드에 대한 데이터가 존재하지 않습니다.'
        );
        error.code = 404;
        throw error;
      } else {
        return playerScore;
      }
    } catch (e) {
      throw e;
    }
  },
};
