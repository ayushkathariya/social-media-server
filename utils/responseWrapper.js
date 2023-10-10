const ta = require("time-ago");

const postsWrapper = (post, userId) => {
  return {
    _id: post._id,
    caption: post.caption,
    image: post.image,
    user: {
      _id: post.user._id,
      name: post.user.name,
      avatar: post.user.avatar,
    },
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
    isLiked: post.likes.includes(userId),
    timeAgo: ta.ago(post.createdAt),
  };
};

const postsWrapperById = (post, userId) => {
  return {
    _id: post._id,
    caption: post.caption,
    image: post.image,
    user: {
      _id: post.user._id,
      name: post.user.name,
      avatar: post.user.avatar,
    },
    comments: post.comments.map((item) => {
      return {
        _id: item._id,
        comment: item.comment,
        timeAgo: ta.ago(item.createdAt),
        user: item.user,
      };
    }),
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
    isLiked: post.likes.includes(userId),
    timeAgo: ta.ago(post.createdAt),
  };
};

const userProfileWrapper = (user, userId) => {
  return {
    _id: user._id,
    name: user.name,
    avatar: user.avatar,
    followersCount: user.followers.length,
    followingsCount: user.followings.length,
    ifCurrentUser: user._id === userId,
  };
};

const userWrapper = (user, userId) => {
  return {
    _id: user._id,
    name: user.name,
    avatar: user.avatar,
    followersCount: user.followers.length,
    followingsCount: user.followings.length,
    ifCurrentUser: user._id === userId,
    posts: user.posts.map((post) => {
      return {
        _id: post._id,
        caption: post.caption,
        image: post.image,
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
        isLiked: post.likes.includes(userId),
        timeAgo: ta.ago(post.createdAt),
        user: {
          _id: post.user._id,
          name: post.user.name,
          avatar: post.user.avatar,
        },
      };
    }),
  };
};

module.exports = {
  postsWrapper,
  postsWrapperById,
  userProfileWrapper,
  userWrapper,
};
