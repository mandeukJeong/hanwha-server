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
  postGalleryImages: async (user, nickname, files, title, date) => {
    try {
      const imageList = [];

      for (let i = 0; i < files.length; i++) {
        imageList.push(files[i].location);
      }

      return await db.collection('gallery').insertOne({
        user,
        nickname,
        title,
        date,
        imgUrl: imageList,
        heart: 0,
      });
    } catch (e) {
      throw e;
    }
  },

  getGalleryImages: async (pageNum, order, renderNum) => {
    try {
      const sortCondition =
        order === 'latest'
          ? { date: -1 }
          : order === 'oldest'
          ? { date: 1 }
          : { heart: -1, date: -1 };

      const totalItems = await db.collection('gallery').countDocuments();

      const imageLists = await db
        .collection('gallery')
        .find()
        .sort(sortCondition)
        .skip((pageNum - 1) * renderNum)
        .limit(renderNum)
        .toArray();

      return {
        totalPages: Math.ceil(totalItems / renderNum),
        imageLists,
      };
    } catch (e) {
      throw e;
    }
  },

  getPostDetail: async (id) => {
    try {
      const postContent = await db
        .collection('gallery')
        .findOne({ _id: new ObjectId(id) });

      if (!postContent) {
        const error = new Error('해당 데이터가 존재하지 않습니다.');
        error.code = 404;
        throw error;
      } else {
        return postContent;
      }
    } catch (e) {
      throw e;
    }
  },

  increaseHeart: async (id) => {
    try {
      const postContent = await db
        .collection('gallery')
        .findOne({ _id: new ObjectId(id) });

      if (!postContent) {
        const error = new Error('해당 데이터가 존재하지 않습니다.');
        error.code = 404;
        throw error;
      } else {
        return await db
          .collection('gallery')
          .updateOne({ _id: new ObjectId(id) }, { $inc: { heart: 1 } });
      }
    } catch (e) {
      throw e;
    }
  },
};
