/* eslint-disable no-unused-vars */
const { User, Tweet, Like, Reply, Message, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize

const messageSequelize = {
  getChatHistory: (myId, otherId) => Message.findAll({
    where: {
      [Op.or]: [{ senderId: myId, receiverId: otherId }, { senderId: otherId, receiverId: myId }]
    },
    order: [[sequelize.col('createdAt'), 'ASC']],
    raw: true,
    nest: true
  }),

  hasNewMessage: (myId, otherId) => Message.findOne({
    where: { senderId: { [Op.ne]: otherId }, receiverId: myId, beenSeen: 0 }
  }),

  seeMessages: (myId, otherId) => Message.update(
    { beenSeen: 1 },
    { where: { senderId: otherId, receiverId: myId } }
  )

}

module.exports = messageSequelize
