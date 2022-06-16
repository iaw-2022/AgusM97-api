const { Router } = require("express");
const router = Router();
const checkJwt = require("./auth");
const userController = require("../controllers/user.controller");
const imageController = require("../controllers/image.controller");
const galleryController = require("../controllers/gallery.controller");

//---ROUTES---

router.get("/galleries", galleryController.getGalleries);

router.get("/gallery/:gallery_id", galleryController.getGalleryById);

router.get(
  "/user/:username/galleries",
  userController.userExistsParam,
  galleryController.getGalleriesByUsername
);

router.get(
  "/image/:image_id/galleries",
  imageController.imageExists,
  galleryController.getGalleriesWithImage
);

router.get(
  "/gallery/:gallery_id/images",
  galleryController.galleryExists,
  galleryController.getGalleryImages
);

router.post(
  "/gallery/:gallery_id/images/:image_id",
  checkJwt,
  galleryController.galleryExists,
  imageController.imageExists,
  galleryController.galleryBelongsToUser,
  galleryController.addImageToGallery
);

router.delete(
  "/gallery/:gallery_id/images/:image_id",
  checkJwt,
  galleryController.galleryExists,
  imageController.imageExists,
  galleryController.galleryBelongsToUser,
  galleryController.removeImageFromGallery
);

router.post("/gallery.new", checkJwt, galleryController.createGallery);

router.delete(
  "/gallery/:gallery_id",
  checkJwt,
  galleryController.galleryBelongsToUser,
  galleryController.deleteGallery
);

module.exports = router;
