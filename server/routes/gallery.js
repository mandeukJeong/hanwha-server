const express = require('express');
const passport = require('passport');
const galleryController = require('../controllers/galleryController');
const upload = require('./../module/multer');

const router = express.Router();
router.post(
  '/upload',
  upload.array('files'),
  galleryController.postGalleryImages
);
router.get('/lists', galleryController.getGalleryImages);
router.get(
  '/detail',
  passport.authenticate('jwt', { session: false }),
  galleryController.getPostDetail
);
router.put(
  '/heart',
  passport.authenticate('jwt', { session: false }),
  galleryController.increaseHeart
);

module.exports = router;
