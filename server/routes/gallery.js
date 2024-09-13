const express = require('express');
const galleryController = require('../controllers/galleryController');
const upload = require('./../module/multer');

const router = express.Router();
router.post(
  '/upload',
  upload.array('files'),
  galleryController.postGalleryImages
);
router.get('/lists', galleryController.getGalleryImages);
router.get('/detail', galleryController.getPostDetail);

module.exports = router;
