const { Router } = require("express");
const router = Router();

const controller = require("../controllers/index.controller");

router.get("/users", controller.getUsers);
router.get("/users.compact", controller.getUsersCompact);
router.get("/user/:id", controller.getUserById);
router.post("/user.new", controller.createUser);

module.exports = router;
