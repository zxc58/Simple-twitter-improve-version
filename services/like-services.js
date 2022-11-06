const { Like, Reply, Tweet, User, sequelize } = require('../models')
const helpers = require('../_helpers')
const likeSequelize = {
  getOnesAllLike: (req) => {
    const UserId = Number(req?.params?.id)
    const { id } = helpers.getUser(req)
    return Like.findAll({
      where: { UserId },
      include: [
        {
          model: Tweet,
          attributes: {
            include: [
              [sequelize.fn('MAX', sequelize.fn('IF', sequelize.literal('`Tweet->Likes`.`UserId`-' + id + '=0'), 1, 0)), 'isLiked'],
              [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Tweet.Replies.id'))), 'totalReply'],
              [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Tweet.Likes.id'))), 'totalLike']
            ]
          },
          include: [
            { model: Reply, attributes: [] },
            { model: Like, attributes: [] },
            { model: User, attributes: { exclude: ['password'] } }
          ]
        }
      ],
      group: 'id',
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
  },
  postLike: (req) => {
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id
    return Like.findOrCreate({
      where: { UserId, TweetId }
    })
  },

  deleteLike: (req) => {
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id
    return Like.destroy({
      where: { UserId, TweetId }
    })
  }
}

module.exports = likeSequelize
