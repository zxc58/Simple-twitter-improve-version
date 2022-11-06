const { User, Tweet, Like, Reply, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize
const [subDescriptionLength] = [50]

const tweetSequelize = {
  getAllTweets: (userId, limit = 20) => Tweet.findAll({
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
    distinct: true,
    group: 'Tweet.id',
    order: [['createdAt', 'DESC']],
    limit,
    raw: true,
    nest: true
  }),
  getTweet: (tweetId, userId = -1) => Tweet.findByPk(tweetId, {
    include: [
      { model: User },
      { model: Like }
    ],
    attributes: {
      include: [
        [sequelize.fn('COUNT', sequelize.col('Likes.id')), 'totalLike'],
        [sequelize.fn('MAX', sequelize.fn('IF', sequelize.literal('`Likes`.`UserId`-' + userId + '=0'), 1, 0)), 'isLiked']
      ]
    }
  }),

  fetchSomeTweets: (tweetsIds, rowLimit, userId) => Tweet.findAll({
    where: {
      id: { [Op.notIn]: tweetsIds }
    },
    include: [
      { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
      { model: Like, attributes: [], duplicating: false },
      { model: Reply, attributes: [], duplicating: false }
    ],
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
  }),

  previewAllTweets: () => Tweet.findAll({
    raw: true,
    nest: true,
    include: [User],
    order: [['createdAt', 'DESC']],
    attributes: {
      include: [[sequelize.fn('SUBSTRING', sequelize.col('Tweet.description'), 1, subDescriptionLength), 'subDescription']]
    }
  }),
  postTweet: (UserId, description) => Tweet.create({
    description,
    UserId
  }),
  deleteTweet: (tweetId, userId) => Tweet.destroy({
    where: {
      id: tweetId,
      userId: userId || /\d+/
    }
  })
}
module.exports = tweetSequelize
