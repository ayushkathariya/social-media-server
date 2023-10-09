const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const { getMyProfile } = require("../controllers/userController");

router.get("/", requireUser, getMyProfile);

module.exports = router;
