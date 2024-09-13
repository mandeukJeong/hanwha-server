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
};
