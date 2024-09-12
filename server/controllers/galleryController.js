const dotenv = require('dotenv');
const galleryService = require('../services/galleryService');

dotenv.config();

module.exports = {
  postGalleryImages: async (req, res) => {
    try {
      console.log(req.files);
      //   if (!req.query.posCd) {
      //     return res
      //       .status(400)
      //       .json({ message: '포지션 코드가 전송되지 않았습니다.' });
      //   }

      //   const playerList = await playerService.getPlayerList(
      //     Number(req.query.posCd)
      //   );
      return res.status(200).send('이미지 업로드 성공');
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};
