const router = require("express").Router();
const { getMyProfile } = require("../controllers/userController");
const requireUser = require("../middlewares/requireUser");

router.get("/getMyProfile", requireUser, getMyProfile);

module.exports = router;
