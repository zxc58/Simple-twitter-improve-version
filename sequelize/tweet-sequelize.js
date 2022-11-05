const { User, Tweet, Like, Reply, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize
const [subDescriptionLength] = [50]

const fetchSomeTweets = (tweetsIds, rowLimit, userId) => Tweet.findAll({
  where: {
    id: { [Op.notIn]: tweetsIds }
  },
  include: [{
    model: User,
    attributes: ['id', 'name', 'avatar', 'account']
  }, {
    model: Like, attributes: [], duplicating: false
  }, {
    model: Reply, attributes: [], duplicating: false
  }],
  attributes: {
    include: [
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Replies.id'))), 'totalReply'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Likes.id'))), 'totalLike'],
      [sequelize.fn('MAX', sequelize.fn('IF', sequelize.literal('`Likes`.`UserId`-' + userId + '=0'), 1, 0)), 'isLiked']
    ]
  },
  group: 'Tweet.id',
  order: [['createdAt', 'DESC']],
  limit: rowLimit,
  raw: true,
  nest: true
})

const previewAllTweets = () => Tweet.findAll({
  raw: true,
  nest: true,
  include: [User],
  order: [['createdAt', 'DESC']],
  attributes: {
    include: [[sequelize.fn('SUBSTRING', sequelize.col('description'), 0, subDescriptionLength), 'subDescriptionLength']]
  }
})

const deleteTweet = (tweetId, userId) => Tweet.destroy({
  where: {
    id: tweetId,
    userId: userId || /\d+/
  }
})

module.exports = {
  fetchSomeTweets,
  previewAllTweets,
  deleteTweet
}
