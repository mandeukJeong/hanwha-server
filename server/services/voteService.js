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
  getVoteList: async () => {
    try {
      const voteList = await db.collection('vote').find().toArray();
      const questionList = [];

      for (let i = 0; i < voteList.length; i++) {
        const voteItem = {
          _id: voteList[i]._id,
          question: voteList[i].question,
          players: [],
        };
        for (let j = 0; j < voteList[i].posCd.length; j++) {
          const playerList = await db
            .collection('players')
            .find(
              { posCd: voteList[i].posCd[j] },
              { projection: { pCd: 1, pNm: 1, img: 1, posCd: 1 } }
            )
            .toArray();
          voteItem.players = [...voteItem.players, ...playerList];
        }
        questionList.push(voteItem);
      }

      return questionList;
    } catch (e) {
      throw e;
    }
  },

  updateVoteList: async (voteDone, userId) => {
    try {
      for (let i = 0; i < voteDone.length; i++) {
        const voteItem = await db
          .collection('vote')
          .findOne({ _id: new ObjectId(voteDone[i]._id) });
        const matchedPlayer = voteItem.voted.find(
          (player) => player.pCd === voteDone[i].pCd
        );

        if (matchedPlayer) {
          await db.collection('vote').updateOne(
            {
              _id: new ObjectId(voteDone[i]._id),
              'voted.pCd': voteDone[i].pCd,
            },
            { $inc: { 'voted.$.count': 1 } }
          );
        } else {
          await db.collection('vote').updateOne(
            { _id: new ObjectId(voteDone[i]._id) },
            {
              $push: {
                voted: {
                  pCd: voteDone[i].pCd,
                  pNm: voteDone[i].pNm,
                  img: voteDone[i].img,
                  count: 1,
                },
              },
            }
          );
        }
      }

      await db
        .collection('user')
        .updateOne({ _id: new ObjectId(userId) }, { $set: { voted: true } });
    } catch (e) {
      throw e;
    }
  },

  isUserVoted: async (userId) => {
    try {
      const isVoted = await db
        .collection('user')
        .findOne({ _id: new ObjectId(userId) });

      if (!isVoted) {
        const error = new Error('존재하지 않는 계정입니다.');
        error.code = 404;
        throw error;
      } else {
        return isVoted.voted;
      }
    } catch (e) {
      throw e;
    }
  },

  getVoteRank: async () => {
    try {
      const voteList = await db.collection('vote').find().toArray();
      const rankList = [];

      for (let i = 0; i < voteList.length; i++) {
        const topVoted = voteList[i].voted.reduce((prev, current) => {
          return prev.count > current.count ? prev : current;
        });

        const rankItem = {
          _id: voteList[i]._id,
          title: voteList[i].title,
          img: topVoted.img,
        };

        rankList.push(rankItem);
      }

      return rankList;
    } catch (e) {
      throw e;
    }
  },

  getVoteResult: async (id) => {
    try {
      const resultList = await db
        .collection('vote')
        .findOne({ _id: new ObjectId(id) });

      resultList.voted.sort((a, b) => b.count - a.count);

      return resultList;
    } catch (e) {
      throw e;
    }
  },
};
