const { getAllUsers, getAllTweets, deleteTweet } = require('../sequelize/admin')
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
    req.flash('success_messages', 'Admin成功登入！')
    res.redirect('/admin/tweets')
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await getAllTweets()
      return res.render('admin/tweets', { tweets })
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const isDeleted = await deleteTweet(id)
      if (!isDeleted) { throw new Error('No such tweet in Database') }
      return res.redirect('/admin/tweets')
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await getAllUsers()
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
