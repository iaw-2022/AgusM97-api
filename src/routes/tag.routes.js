const { Router } = require("express");
const router = Router();
const tagController = require("../controllers/tag.controller");

//---ROUTES---

router.get("/tags", tagController.getTags);

router.get("/tag/id/:id", tagController.getTagById);

router.get("/tag/:name", tagController.getTagByName);

module.exports = router;
