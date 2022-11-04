const { User, Tweet, sequelize, Like, Reply, Message, Sequelize } = require('../models')
const { Op } = Sequelize
const getPersonalData = (id) => User.findByPk(id, {
  include: [
    { model: User, as: 'Followings' },
    { model: User, as: 'Followers' }
  ]
})

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

const getChatHistory = (myId, otherId) => Message.findAll({
  where: {
    [Op.or]: [{ senderId: myId, receiverId: otherId }, { senderId: otherId, receiverId: myId }]
  },
  order: [[sequelize.col('createdAt'), 'ASC']],
  raw: true,
  nest: true
})

const hasNewMessage = (myId, otherId) => Message.findOne({
  where: { senderId: { [Op.ne]: otherId }, receiverId: myId, beenSeen: 0 }
})

const seeMessages = (myId, otherId) => Message.update(
  { beenSeen: 1 },
  { where: { senderId: otherId, receiverId: myId } }
)

module.exports = {
  getPersonalData,
  fetchSomeTweets,
  getChatHistory,
  hasNewMessage,
  seeMessages
}
