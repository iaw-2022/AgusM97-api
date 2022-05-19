const { Router } = require("express");
const router = Router();

const controller = require("../controllers/index.controller");

router.get("/users", controller.getUsers);
router.get("/users.compact", controller.getUsersCompact);
router.get("/user/:username", controller.getUserByUsername);
router.get("/user/id/:id", controller.getUserById);
router.get("/user/email/:email", controller.getUserByEmail);
router.post("/user.new", controller.createUser);
router.delete("/user/id/:id", controller.deleteUser);

router.get("/images", controller.getImages);
router.get("/images.compact", controller.getImagesCompact);
router.get("/image/:id", controller.getImageById);
router.get("/image/:id/tags", controller.getImageTags);
router.get("/user/:username/images", controller.getImagesByUsername);
router.get("/user/id/:id/images", controller.getImagesByUserId);
router.get("/user/email/:email/images", controller.getImagesByEmail);

module.exports = router;
