const { User, Tweet, Like, Message, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize

const userSequelize = {
  getAllUsers: () => User.findAll({
    where: {
      role: 'user'
    },
    include: [
      { model: Tweet, include: { model: Like, attributes: [] }, attributes: [] },
      { model: User, as: 'Followers', attributes: [], through: { attributes: [] } },
      { model: User, as: 'Followings', attributes: [], through: { attributes: [] } }
    ],
    attributes: [
      'name', 'account', 'avatar', 'cover',
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Tweets.id'))), 'tweetCount'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followers.id'))), 'followerCount'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followings.id'))), 'followingCount'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Tweets.Likes.id'))), 'likeCount']
    ],
    group: sequelize.col('User.id'),
    order: [[sequelize.col('tweetCount'), 'DESC']],
    nest: true,
    raw: true
  }),

  getPersonalData: (id) => User.findByPk(id, {
    include: [
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' }
    ]
  }),

  getChatUsers: (userId) => User.findAll({
    where: {
      [Op.or]: [sequelize.where(sequelize.col('sentMessages.receiverId'), userId), sequelize.where(sequelize.col('receivedMessages.senderId'), userId)]
    },
    include: [
      { model: Message, as: 'sentMessages', where: { receiverId: userId }, required: false, order: [[sequelize.col('sentMessages.createdAt'), 'DESC']] },
      { model: Message, as: 'receivedMessages', where: { senderId: userId }, required: false, order: [[sequelize.col('receivedMessages.createdAt'), 'DESC']] }
    ],
    group: sequelize.col('User.id'),
    raw: true,
    nest: true
  })
}
module.exports = userSequelize
