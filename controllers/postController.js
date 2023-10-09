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

module.exports = {
  createPostController,
};
