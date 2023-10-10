const User = require("../models/User");
const { userProfileWrapper, userWrapper } = require("../utils/responseWrapper");

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

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    const user = await User.findById(userId).populate({
      path: "posts",
      populate: { path: "user" },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wrappedUser = userWrapper(user, req._id);

    return res.json({ user: wrappedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const followUserController = async (req, res) => {
  try {
    const params = req.params;
    const userIdToFollow = params.userId;
    if (!userIdToFollow) {
      return res.status(400).json({ message: "User id is required" });
    }

    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ message: "Not found" });
    }

    const user = await User.findById(req._id);
    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }

    if (userToFollow._id.toString() === user._id.toString()) {
      return res.status(409).json({ message: "Not allowed" });
    }

    if (userToFollow.followers.includes(req._id)) {
      const userIdIndex = userToFollow.followers.indexOf(req._id);
      const userToFollowIdIndex = user.followings.indexOf(userIdToFollow);

      user.followings.splice(userToFollowIdIndex, 1);
      userToFollow.followers.splice(userIdIndex, 1);
      await user.save();
      await userToFollow.save();

      return res.status(200).json({ message: "Unfollow successful" });
    } else {
      userToFollow.followers.push(req._id);
      user.followings.push(userIdToFollow);
      await userToFollow.save();
      await user.save();
      return res.status(200).json({ message: "Follow successful" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const findFriendsController = async (req, res) => {
  try {
    const findFriends = await User.find({
      followers: { $nin: req._id },
      _id: { $nin: req._id },
      isVerified: true,
    });

    const wrappedFindFriends = findFriends.map((user) =>
      userProfileWrapper(user, req._id)
    );

    return res.status(200).json({ findFriends: wrappedFindFriends });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const searchUserController = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const regex = new RegExp(name, "i");

    const users = await User.find({ name: regex, _id: { $nin: req._id } });

    const wrappedUsers = users.map((user) => userProfileWrapper(user, req._id));

    return res.status(200).json({ users: wrappedUsers });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMyProfile,
  getUser,
  followUserController,
  findFriendsController,
  searchUserController,
};
