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
        req.cookies.nickname,
        req.files,
        req.body.title,
        req.body.date
      );

      return res.status(200).send('이미지 업로드 성공');
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  getGalleryImages: async (req, res) => {
    try {
      if (!req.body.pageNum) {
        return res
          .status(400)
          .json({ message: '페이지 번호가 전송되지 않았습니다.' });
      }

      if (!req.body.order) {
        return res
          .status(400)
          .json({ message: '정렬 기준이 전송되지 않았습니다.' });
      }

      if (!req.body.renderNum) {
        return res.status(400).json({
          message: '한 번에 렌더링 할 게시물 숫자가 전송되지 않았습니다.',
        });
      }

      if (!['latest', 'oldest', 'heart'].includes(req.body.order)) {
        return res
          .status(400)
          .json({ message: '정렬 기준이 올바르지 않습니다.' });
      }

      const imageList = await galleryService.getGalleryImages(
        Number(req.body.pageNum),
        req.body.order,
        Number(req.body.renderNum)
      );

      return res.status(200).send(imageList);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};
