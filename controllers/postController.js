const User = require("../models/User");
const Post = require("../models/Post");
const cloudinary = require("cloudinary").v2;

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

    const post = await Post.create({
      user: req._id,
      caption,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.url,
      },
    });

    user.posts.push(post._id);
    await user.save();

    return res.status(201).json({ post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getPostByIdController = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Post id is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const likePostByIdController = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Post id is required" });
    }

    const curUserId = req._id;

    const post = await Post.findById(postId).populate("user");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(curUserId)) {
      const index = post.likes.indexOf(curUserId);
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).json({ message: "Post unliked successful" });
    } else {
      post.likes.push(curUserId);
      await post.save();
      return res.status(200).json({ message: "Post liked successful" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPostController,
  getPostByIdController,
  likePostByIdController,
};
