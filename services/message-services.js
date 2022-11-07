/* eslint-disable no-unused-vars */
const { User, Tweet, Like, Reply, Message, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize
const helpers = require('../_helpers')
const messageSequelize = {
  getChatHistory: (req) => {
    const myId = helpers.getUser(req).id
    const anotherId = Number(req.params.id)
    return Message.findAll({
      where: {
        [Op.or]: [{ senderId: myId, receiverId: anotherId }, { senderId: anotherId, receiverId: myId }]
      },
      order: [[sequelize.col('createdAt'), 'ASC']],
      raw: true,
      nest: true
    })
  },

  hasNewMessage: (req) => {
    const myId = helpers.getUser(req).id
    const anotherId = Number(req.params.id)
    return Message.findOne({
      where: { senderId: { [Op.ne]: anotherId }, receiverId: myId, beenSeen: 0 }
    })
  },

  seeMessages: (req) => {
    const myId = helpers.getUser(req).id
    const anotherId = Number(req.params.id)
    return Message.update(
      { beenSeen: 1 },
      { where: { senderId: anotherId, receiverId: myId } }
    )
  }
}

module.exports = messageSequelize
