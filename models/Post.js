const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    caption: {
      type: String,
      // required: true,
    },
    image: {
      publicId: String,
      url: String,
      // required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", postSchema);
