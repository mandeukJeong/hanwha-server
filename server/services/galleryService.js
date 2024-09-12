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
  postGalleryImages: async (user, files, title, date) => {
    try {
      const imageList = [];

      for (let i = 0; i < files.length; i++) {
        imageList.push(files[i].location);
      }

      return await db.collection('gallery').insertOne({
        user,
        title,
        date,
        imgUrl: imageList,
        heart: 0,
      });
    } catch (e) {
      throw e;
    }
  },
};
