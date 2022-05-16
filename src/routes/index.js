const { Router } = require("express");
const router = Router();

const controller = require("../controllers/index.controller");

router.get("/users", controller.getUsers);

module.exports = router;
