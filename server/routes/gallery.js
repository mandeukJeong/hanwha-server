const express = require('express');
const galleryController = require('../controllers/galleryController');
const upload = require('./../module/multer');

const router = express.Router();
router.post(
  '/upload',
  upload.array('files'),
  galleryController.postGalleryImages
);

module.exports = router;
