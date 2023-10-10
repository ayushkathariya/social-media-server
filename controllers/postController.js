const User = require("../models/User");
const Post = require("../models/Post");
const cloudinary = require("cloudinary").v2;
const { postsWrapper, postsWrapperById } = require("../utils/responseWrapper");

const getPostsController = async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    if (!posts) {
      return res.status(404).json({ message: "Post not found" });
    }

    const wrappedPosts = posts
      .map((item) => postsWrapper(item, req._id))
      .reverse();

    return res.status(200).json({ posts: wrappedPosts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createPostController = async (req, res) => {
  try {
    const { caption, image } = req.body;
    if (!caption || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cloudImg = await cloudinary.uploader.upload(image, {
      folder: "testImage",
    });

    const user = await User.findById(req._id);

    const posts = await Post.create({
      user: req._id,
      caption,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.url,
      },
    });

    user.posts.push(posts._id);
    await user.save();

    return res.status(201).json({ posts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getPostController = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Post id is required" });
    }

    const post = await Post.findById(postId)
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "user" },
      });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const wrappedPost = postsWrapperById(post, req._id);

    return res.status(200).json({ post: wrappedPost });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const likePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Post id is required" });
    }

    const curUserId = req._id;

    const posts = await Post.findById(postId).populate("user");
    if (!posts) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (posts.likes.includes(curUserId)) {
      const index = posts.likes.indexOf(curUserId);
      posts.likes.splice(index, 1);
      await posts.save();
      return res.status(200).json({ message: "Post unliked successful" });
    } else {
      posts.likes.push(curUserId);
      await posts.save();
      return res.status(200).json({ message: "Post liked successful" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getFollowingsPostsController = async (req, res) => {
  try {
    const curUser = await User.findById(req._id);
    const followingsIds = curUser.followings.map((item) => item.toString());

    const posts = await Post.find({ user: { $in: followingsIds } }).populate(
      "user"
    );

    const wrappedPosts = posts
      .map((item) => postsWrapper(item, req._id))
      .reverse();

    return res.status(200).json({ posts: wrappedPosts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPostsController,
  createPostController,
  getPostController,
  likePostController,
  getFollowingsPostsController,
};
