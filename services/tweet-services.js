const { User, Tweet, Like, Reply, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize
const helpers = require('../_helpers')
const [subDescriptionLength, limit] = [50, 20]

const tweetSequelize = {
  getOnesAllTweets: (req) => { // For view/partial/tweet-block.hbs
    const UserId = Number(req?.params?.id)
    const { id } = helpers.getUser(req)
    return Tweet.findAll({
      where: { UserId },
      include: [
        { model: Reply, attributes: [] },
        { model: Like, attributes: [] },
        { model: User, attributes: { exclude: ['password'] } }
      ],
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Replies.id'))), 'totalReply'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Likes.id'))), 'totalLike'],
          [sequelize.fn('MAX', sequelize.fn('IF', sequelize.literal('`Likes`.`UserId`-' + id + '=0'), 1, 0)), 'isLiked']
        ]
      },
      group: 'id',
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
  },

  getAllTweets: (req) => {
    const userId = helpers.getUser(req).id
    return Tweet.findAll({
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
    })
  },

  getTweet: (req) => {
    const tweetId = Number(req.params.id)
    const userId = helpers.getUser(req).id
    return Tweet.findByPk(tweetId, {
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
    })
  },

  fetchSomeTweets: (req) => {
    const { tweetsIds } = req.body
    const { id } = helpers.getUser(req)
    return Tweet.findAll({
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
          [sequelize.fn('MAX', sequelize.fn('IF', sequelize.literal('`Likes`.`UserId`-' + id + '=0'), 1, 0)), 'isLiked']
        ]
      },
      group: 'Tweet.id',
      order: [['createdAt', 'DESC']],
      limit,
      raw: true,
      nest: true
    })
  },

  previewAllTweets: (req) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']],
      attributes: {
        include: [[sequelize.fn('SUBSTRING', sequelize.col('Tweet.description'), 1, subDescriptionLength), 'subDescription']]
      }
    })
  },

  postTweet: (req) => {
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    return Tweet.create({
      description,
      UserId
    })
  },

  deleteTweet: (req) => {
    const id = Number(req.params.id)
    return Tweet.destroy({
      where: { id }
    })
  }
}
module.exports = tweetSequelize
