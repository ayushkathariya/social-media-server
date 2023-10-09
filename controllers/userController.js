const User = require("../models/User");

const getMyProfile = async (req, res) => {
  try {
    const curUserId = req._id;

    const curUser = await User.findById(curUserId);

    if (!curUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ curUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMyProfile,
};
