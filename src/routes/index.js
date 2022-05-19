const { Router } = require("express");
const router = Router();

const userController = require("../controllers/user.controller");
const imageController = require("../controllers/image.controller");

router.get("/users", userController.getUsers);
router.get("/users.compact", userController.getUsersCompact);
router.get("/user/:username", userController.getUserByUsername);
router.get("/user/id/:id", userController.getUserById);
router.get("/user/email/:email", userController.getUserByEmail);
router.patch("/user/:username/bio", userController.updateUserBio);
router.patch("/user/:username/picture", userController.updateUserBio);
router.post("/user.new", userController.createUser);
router.delete("/user/id/:id", userController.deleteUser);

router.get("/images", imageController.getImages);
router.get("/images.compact", imageController.getImagesCompact);
router.get("/image/:id", imageController.getImageById);
router.get("/image/:id/tags", imageController.getImageTags);
router.get("/user/:username/images", imageController.getImagesByUsername);
router.get("/user/id/:id/images", imageController.getImagesByUserId);
router.get("/user/email/:email/images", imageController.getImagesByEmail);

module.exports = router;
