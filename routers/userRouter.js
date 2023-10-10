const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const {
  getMyProfile,
  getUser,
  followUserController,
  findFriendsController,
  searchUserController,
} = require("../controllers/userController");

router.get("/me", requireUser, getMyProfile);
router.get("/search/:name", requireUser, searchUserController);
router.get("/find-friends", requireUser, findFriendsController);
router.get("/:userId", requireUser, getUser);
router.post("/:userId/follow", requireUser, followUserController);

module.exports = router;
