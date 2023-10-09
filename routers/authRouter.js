const router = require("express").Router();
const {
  loginController,
  signupController,
  verifyOTPController,
} = require("../controllers/authController");

router.post("/login", loginController);
router.post("/signup", signupController);
router.post("/verify-otp", verifyOTPController);

module.exports = router;
