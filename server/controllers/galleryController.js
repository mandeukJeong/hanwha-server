const dotenv = require('dotenv');
const galleryService = require('../services/galleryService');

dotenv.config();

module.exports = {
  postGalleryImages: async (req, res) => {
    try {
      if (!req.files) {
        return res
          .status(400)
          .json({ message: '이미지 파일이 전송되지 않았습니다.' });
      }

      await galleryService.postGalleryImages(
        req.cookies.user,
        req.files,
        req.body.title,
        req.body.date
      );

      return res.status(200).send('이미지 업로드 성공');
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};
