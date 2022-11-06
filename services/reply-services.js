/* eslint-disable no-unused-vars */
const { User, Tweet, Like, Reply, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize
const replySequelize = {
  getTweetReply: (TweetId) => Reply.findAndCountAll({
    where: { TweetId },
    include: {
      model: User, attributes: ['id', 'name', 'account', 'avatar']
    },
    raw: true,
    nest: true,
    order: [['createdAt', 'DESC']]
  }),

  reply: (TweetId, UserId, comment) => Reply.create({
    TweetId,
    UserId,
    comment
  })
}

module.exports = replySequelize
