const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const { createPostController } = require("../controllers/postController");

router.post("/", requireUser, createPostController);

module.exports = router;
