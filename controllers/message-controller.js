const { userServices } = require('../services')
const helpers = require('../_helpers')

const messageController = {
  chatPage: async (req, res, next) => {
    try {
      const id = helpers.getUser(req).id
      const chatUsers = await userServices.getChatUsers(id)
      return res.render('chat', { chatUsers })
    } catch (err) {
      next(err)
    }
  },
  startChattingWith: async (req, res, next) => {
    try {
      const id = helpers.getUser(req).id
      const newChattingId = Number(req.params.id)
      const [chatUsers, newChatting] = await Promise.all([
        userServices.getChatUsers(id),
        userServices.getPersonalData(newChattingId)
      ])
      return res.render('chat', { chatUsers, newChatting: JSON.stringify(newChatting.toJSON()) })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = messageController
