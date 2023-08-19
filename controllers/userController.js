const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");

const getMyProfile = async (req, res) => {
  try {
    const curUserId = req._id;

    const curUser = await User.findById(curUserId);

    if (!curUser) {
      return res.send(error(404, "User not found."));
    }

    return res.send(success(200, { curUser }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  getMyProfile,
};
