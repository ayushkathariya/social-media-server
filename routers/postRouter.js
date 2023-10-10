const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const {
  createPostController,
  getPostController,
  likePostController,
  getPostsController,
  getFollowingsPostsController,
} = require("../controllers/postController");

router.get("/", requireUser, getPostsController);
router.post("/", requireUser, createPostController);
router.get("/followings", requireUser, getFollowingsPostsController);
router.get("/:postId", requireUser, getPostController);
router.post("/:postId/like", requireUser, likePostController);

module.exports = router;
