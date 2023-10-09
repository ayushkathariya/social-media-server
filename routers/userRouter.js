const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const { getMyProfile } = require("../controllers/userController");

router.get("/me", requireUser, getMyProfile);

module.exports = router;
