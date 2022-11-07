/* eslint-disable no-unused-vars */
const { User, Tweet, Like, Reply, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize
const helpers = require('../_helpers')
const replySequelize = {
  getOnesAllReply: (req) => {
    const UserId = Number(req?.params?.id)
    return Reply.findAll({
      where: { UserId },
      include: [
        { model: Tweet, include: [{ model: User, attributes: { exclude: ['password'] } }] }
      ],
      group: 'id',
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
  },
  getTweetReply: (req) => {
    const TweetId = Number(req.params.id)
    return Reply.findAndCountAll({
      where: { TweetId },
      include: {
        model: User, attributes: ['id', 'name', 'account', 'avatar']
      },
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']]
    })
  },

  postReply: (req) => {
    const UserId = helpers.getUser(req).id
    const TweetId = Number(req.params.id)
    const { comment } = req.body
    return Reply.create({
      TweetId,
      UserId,
      comment
    })
  }
}

module.exports = replySequelize
