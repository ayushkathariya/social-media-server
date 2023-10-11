const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const {
  getMyProfile,
  getUser,
  followUserController,
  findFriendsController,
  searchUserController,
  usersSuggestionController,
  followingsSuggestionController,
  followingUsersController,
  updateUserController,
} = require("../controllers/userController");

router.get("/me", requireUser, getMyProfile);
router.post("/update", requireUser, updateUserController);
router.get("/followings", requireUser, followingsSuggestionController);
router.get("/followings-user", requireUser, followingUsersController);
router.get("/suggestions", requireUser, usersSuggestionController);
router.get("/search/:name", requireUser, searchUserController);
router.get("/find-friends", requireUser, findFriendsController);
router.get("/:userId", requireUser, getUser);
router.post("/:userId/follow", requireUser, followUserController);

module.exports = router;
