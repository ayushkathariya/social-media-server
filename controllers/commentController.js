const Comment = require("../models/Comment");
const Post = require("../models/Post");

const getComment = async (req, res) => {
  try {
    const comments = await Comment.find();
    return res.status(200).json({ comments });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { comment, postId } = req.body;
    if (!comment || !postId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const createdComment = await Comment.create({
      comment,
      user: req._id,
      post: post._id,
    });

    post.comments.push(createdComment._id);
    await post.save();

    return res.status(201).json({ comment: createdComment });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getComment,
  createComment,
};
