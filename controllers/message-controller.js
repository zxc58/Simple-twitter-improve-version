const { getChatUsers, getPersonalData } = require('../sequelize/user-sequelize')
const helpers = require('../_helpers')

const messageController = {
  chatPage: async (req, res, next) => {
    try {
      const id = helpers.getUser(req).id
      const chatUsers = await getChatUsers(id)
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
        getChatUsers(id),
        getPersonalData(newChattingId)
      ])
      return res.render('chat', { chatUsers, newChatting: JSON.stringify(newChatting.toJSON()) })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = messageController
