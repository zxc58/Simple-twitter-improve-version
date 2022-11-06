const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { userServices, tweetServices, messageServices } = require('../services')
const [rowLimit] = [20]

const apiController = {
  getUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (helpers.getUser(req).id !== id) {
        return res.json({ status: 'error', messages: '無法編輯其他使用者資料！' })
      }
      const user = await userServices.getPersonalData(id)
      res.json(user.toJSON())
    } catch (err) {
      next(err)
    }
  },

  putUser: async (req, res, next) => {
    try {
      const logInUserId = helpers.getUser(req).id
      const id = Number(req.params.id)
      const { name } = req.body
      const introduction = req.body.introduction || ''
      const avatar = req?.files?.avatar
      const cover = req?.files?.cover
      if (id !== Number(logInUserId)) return res.json({ status: 'error', message: '不可編輯其他使用者資料！' })
      if (!name) return res.json({ status: 'error', message: '名稱不可空白！' })
      if (name.length > 50) return res.json({ status: 'error', message: '字數超出上限！' })
      if (introduction.length > 160) return res.json({ status: 'error', message: '字數超出上限！' })

      const tasks = [userServices.getPersonalData(id)]
      tasks.push(avatar ? imgurFileHandler(avatar[0]) : false)
      tasks.push(cover ? imgurFileHandler(cover[0]) : false)
      const [user, uploadAvatar, uploadCover] = await Promise.all(tasks);
      [user.name, user.introduction, user.avatar, user.cover] = [name, introduction, uploadAvatar || user.avatar, uploadCover || user.cover]
      const data = await user.save()
      res.json({ status: 'success', message: '已成功更新!', data })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const { tweetsIds } = req.body
      const tweets = await tweetServices.fetchSomeTweets(tweetsIds, rowLimit, helpers.getUser(req).id)
      return res.json({ tweets, logInUser: helpers.getUser(req) })
    } catch (error) {
      next(error)
    }
  },
  getMessages: async (req, res, next) => {
    try {
      const myId = helpers.getUser(req).id
      const otherId = Number(req.params.id)
      const [chatHistory, newMessage] = await Promise.all([
        messageServices.getChatHistory(myId, otherId),
        messageServices.hasNewMessage(myId, otherId),
        messageServices.seeMessages(myId, otherId)
      ])
      res.json({ status: 'success', data: chatHistory, newMessage: !!newMessage })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = apiController
