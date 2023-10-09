const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const {
  createPostController,
  getPostByIdController,
  likePostByIdController,
} = require("../controllers/postController");

router.post("/", requireUser, createPostController);
router.get("/:postId", requireUser, getPostByIdController);
router.post("/:postId/like", requireUser, likePostByIdController);

module.exports = router;
