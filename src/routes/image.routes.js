const { Router } = require("express");
const router = Router();
const checkJwt = require("./auth");
const userController = require("../controllers/user.controller");
const imageController = require("../controllers/image.controller");
const tagController = require("../controllers/tag.controller");

//---ROUTES---

router.get("/images", imageController.getImages);

router.get("/images.compact", imageController.getImagesCompact);

router.get("/image/:image_id", imageController.getImageById);

router.get(
  "/image/:image_id/tags",
  imageController.imageExists,
  imageController.getImageTags
);

router.get(
  "/user/:username/images",
  userController.userExistsParam,
  imageController.getImagesByUsername
);

router.patch(
  "/image/:image_id/description",
  checkJwt,
  imageController.imageExists,
  imageController.imageBelongsToUser,
  imageController.updateImageDescription
);

router.post(
  "/image/:image_id/tags/:tag_id",
  checkJwt,
  tagController.tagExists,
  imageController.imageExists,
  imageController.imageBelongsToUser,
  imageController.addTagToImage
);

router.delete(
  "/image/:image_id/tags/:tag_id",
  checkJwt,
  tagController.tagExists,
  imageController.imageExists,
  imageController.imageBelongsToUser,
  imageController.removeTagFromImage
);

router.post("/image.new", checkJwt, imageController.uploadImage);

router.delete("/image/:image_id", checkJwt, imageController.deleteImage);

module.exports = router;
