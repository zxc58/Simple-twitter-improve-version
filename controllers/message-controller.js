const { userServices } = require('../services')

const messageController = {
  chatPage: async (req, res, next) => {
    try {
      const chatUsers = await userServices.getChatUsers(req)
      return res.render('chat', { chatUsers })
    } catch (err) {
      next(err)
    }
  },
  startChattingWith: async (req, res, next) => {
    try {
      const [chatUsers, newChatting] = await Promise.all([
        userServices.getChatUsers(req),
        userServices.getPersonalData(req)
      ])
      return res.render('chat', { chatUsers, newChatting: newChatting.toJSON() })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = messageController
