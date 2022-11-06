// const { getAllUsers, getAllTweets, deleteTweet } = require('../sequelize/admin')
const { userServices, tweetServices } = require('../services')
const helpers = require('../_helpers')
const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role === 'user') {
      return req.logout(() => {
        req.flash('error_messages', '帳號不存在')
        res.redirect('/signin')
      })
    }
    req.flash('success_messages', 'Admin成功登入!')
    return res.redirect('/admin/tweets')
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await tweetServices.previewAllTweets(req)
      return res.render('admin/tweets', { tweets })
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const isDeleted = await tweetServices.deleteTweet(req)
      if (!isDeleted) { throw new Error('No such tweet in Database') }
      return res.redirect('/admin/tweets')
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await userServices.getAllUsers(req)
      return res.render('admin/users', { users })
    } catch (error) {
      next(error)
    }
  },
  logout: (req, res) => {
    return req.logout(() => {
      req.flash('success_messages', '登出成功!')
      res.redirect('/admin/signin')
    })
  }
}

module.exports = adminController
