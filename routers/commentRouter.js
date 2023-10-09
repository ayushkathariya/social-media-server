const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const {
  getComment,
  createComment,
} = require("../controllers/commentController");

router.get("/", requireUser, getComment);
router.post("/", requireUser, createComment);

module.exports = router;
