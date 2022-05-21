const { Router } = require("express");
const router = Router();

const userController = require("../controllers/user.controller");
const imageController = require("../controllers/image.controller");
const tagController = require("../controllers/tag.controller");
const galleryController = require("../controllers/gallery.controller");

//--USERS--
router.get("/users", userController.getUsers);
router.get("/users.compact", userController.getUsersCompact);
router.get("/user/:username", userController.getUserByUsername);
router.get("/user/id/:id", userController.getUserById);
router.get("/user/email/:email", userController.getUserByEmail);
router.patch(
  "/user/:username/email",
  userController.emailTaken,
  userController.updateUserEmail
);
router.patch("/user/:username/bio", userController.updateUserBio);
router.patch("/user/:username/picture", userController.updateUserPicture);
router.post(
  "/user.new",
  userController.usernameTaken,
  userController.emailTaken,
  userController.passwordTaken,
  userController.createUser
);
router.delete("/user/:username", userController.deleteUser);

//--TAGS--
router.get("/tags", tagController.getTags);
router.get("/tag/id/:id", tagController.getTagById);
router.get("/tag/:name", tagController.getTagByName);

//--IMAGES--
router.get("/images", imageController.getImages);
router.get("/images.compact", imageController.getImagesCompact);
router.get("/image/:id", imageController.getImageById);
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
router.patch("/image/:id/description", imageController.updateImageDescription);
router.post(
  "/image/:image_id/tags.add/:tag_id",
  tagController.tagExists,
  imageController.imageExists,
  imageController.addTagToImage
);
router.delete(
  "/image/:image_id/tags.remove/:tag_id",
  tagController.tagExists,
  imageController.imageExists,
  imageController.removeTagFromImage
);
router.post(
  "/image.new",
  userController.userExistsBody,
  imageController.uploadImage
);
router.delete("/image/:id", imageController.deleteImage);

//--GALLERIES--
router.get("/galleries", galleryController.getGalleries);
router.get("/gallery/:id", galleryController.getGalleryById);
router.get(
  "/user/:username/galleries",
  userController.userExistsParam,
  galleryController.getGalleriesByUsername
);
router.get(
  "/gallery/:gallery_id/images",
  galleryController.galleryExists,
  galleryController.getGalleryImages
);
router.post(
  "/gallery/:gallery_id/images.add/:image_id",
  galleryController.galleryExists,
  imageController.imageExists,
  galleryController.addImageToGallery
);
router.delete(
  "/gallery/:gallery_id/images.remove/:image_id",
  galleryController.galleryExists,
  imageController.imageExists,
  galleryController.removeImageFromGallery
);
router.post(
  "/gallery.new",
  userController.userExistsBody,
  galleryController.createGallery
);
router.delete("/gallery/:id", galleryController.deleteGallery);

module.exports = router;
