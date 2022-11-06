const { Like } = require('../models')

const likeSequelize = {
  postLike: (UserId, TweetId) => Like.findOrCreate({
    where: { UserId, TweetId }
  }),
  deleteLike: (UserId, TweetId) => Like.destroy({
    where: { UserId, TweetId }
  })
}

module.exports = likeSequelize
