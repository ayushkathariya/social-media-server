const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const {
  createPostController,
  getPostController,
  likePostController,
} = require("../controllers/postController");

router.post("/", requireUser, createPostController);
router.get("/:postId", requireUser, getPostController);
router.post("/:postId/like", requireUser, likePostController);

module.exports = router;
