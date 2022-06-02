const { Router } = require("express");
const router = Router();
const checkJwt = require("./auth");
const userController = require("../controllers/user.controller");

//---ROUTES---

router.get("/users", userController.getUsers);

router.get("/users.compact", userController.getUsersCompact);

router.get("/user/:username", userController.getUserByUsername);

router.get("/user/id/:user_id", userController.getUserById);

router.get("/user/email/:email", userController.getUserByEmail);

router.patch("/user/bio", checkJwt, userController.updateUserBio);

router.patch("/user/picture", checkJwt, userController.updateUserPicture);
/*
router.post(
  "/user.new",
  userController.usernameTaken,
  userController.emailTaken,
  userController.passwordTaken,
  userController.createUser
);
router.delete("/user/:username", userController.deleteUser);
*/

module.exports = router;
