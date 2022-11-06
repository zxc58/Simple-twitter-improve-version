const helpers = require('../_helpers')
const { userServices, tweetServices, likeServices, replyServices } = require('../services')
const userController = {
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      return req.logout(() => {
        req.flash('error_messages', '帳號不存在！')
        res.redirect('/signin')
      })
    }
    req.flash('success_messages', '登入成功!')
    return res.redirect('/tweets')
  },

  signUpPage: (req, res) => {
    return res.render('register')
  },

  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      // eslint-disable-next-line no-useless-escape
      const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
      if (!account || !email || !password) throw new Error('請確實填寫欄位!')
      if (password !== checkPassword) throw new Error('請確認密碼!')
      if (name.length > 50) throw new Error('字數超出上限！')
      if (email.search(emailRule) === -1) throw new Error('請確認Email格式!')
      const user = (await userServices.checkDuplicates(req)).toJSON()
      if (user.email === email) { throw new Error('email 已重複註冊！') }
      if (user.account === account) { throw new Error('account 已重複註冊！') }
      await userServices.postUser(req)
      req.flash('success_message', '成功註冊帳號!')
      return res.redirect('/signin')
    } catch (error) {
      next(error)
    }
  },

  logout: (req, res) => {
    return req.logout(() => {
      req.flash('success_messages', '登出成功!')
      res.redirect('/signin')
    })
  },

  getSetting: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (id !== helpers.getUser(req).id) { throw new Error('無法編輯他人資料!') }
      const user = (await userServices.getPersonalData(req)).toJSON()
      return res.render('profile', { user })
    } catch (error) {
      next(error)
    }
  },

  putUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (helpers.getUser(req).id !== id) { throw new Error('無法編輯他人資料!') }
      const { account, email, password, passwordCheck } = req.body
      // eslint-disable-next-line no-useless-escape
      const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/

      if (!account) throw new Error('請輸入帳號!')
      if (!email) throw new Error('請輸入Email!')
      if (email.search(emailRule) === -1) throw new Error('請確認Email格式!')
      if (!password) throw new Error('請輸入密碼!')
      if (password !== passwordCheck) throw new Error('請確認密碼!')

      const checkResult = (await userServices.checkDuplicates(req))?.toJSON()
      if (checkResult.email === email) { throw new Error('email 已重複註冊！') }
      if (checkResult.account === account) { throw new Error('account 已重複註冊！') }
      await userServices.putUser(req)
      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect('/')
    } catch (error) {
      next(error)
    }
  },

  getUser: async (req, res, next) => {
    try {
      const [user, tweets, topUsers] = await Promise.all([
        userServices.getPersonalData(req),
        tweetServices.getOnesAllTweets(req),
        userServices.getTopUsers(req)
      ])
      if (!user) { throw new Error('User do not exists!') }
      return res.render('user', { user: user.toJSON(), topUsers, tweets })
    } catch (error) {
      next(error)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const [user, topUsers, likes] = await Promise.all([
        userServices.getPersonalData(req),
        userServices.getTopUsers(req),
        likeServices.getOnesAllLike(req)
      ])
      if (!user) throw new Error('User do not exists!')
      return res.render('user', { user: user.toJSON(), likes, topUsers })
    } catch (error) {
      next(error)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const [user, topUsers, userReplies] = await Promise.all([
        userServices.getPersonalData(req),
        userServices.getTopUsers(req),
        replyServices.getOnesAllReply(req)
      ])
      if (!user) { throw new Error('User do not exists!') }
      return res.render('user', { user: user.toJSON(), userReplies, topUsers })
    } catch (error) {
      next(error)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const [data, topUsers] = await Promise.all([
        userServices.getFollowers(req),
        userServices.getTopUsers(req)
      ])
      if (!data) throw new Error("User didn't exists!")
      const user = data.toJSON()
      user.Followers.forEach(e => {
        e.isFollowed = e.Followers.some(f => f.id === helpers.getUser(req).id)
      })
      return res.render('followers', {
        data: user,
        topUsers,
        tweetsCounts: user.Tweets.length,
        followers: 'followers'
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const [data, topUsers] = await Promise.all([
        userServices.getFollowings(req),
        userServices.getTopUsers(req)
      ])
      if (!data) throw new Error("User didn't exists!")
      const user = data.toJSON()
      user.Followings.forEach(e => {
        e.isFollowed = e.Followers.some(f => f.id === helpers.getUser(req).id)
      })
      return res.render('followings', {
        data: user,
        topUsers,
        tweetsCounts: user.Tweets.length,
        followings: 'followings'
      })
    } catch (err) {
      next(err)
    }
  },
  searchUser: async (req, res, next) => {
    try {
      const name = req.query.q || null
      if (name === null) { throw new Error("User didn't exists!") }
      const [userSearchResult, topUsers] = await Promise.all([
        userServices.searchUsers(req),
        userServices.getTopUsers(req)
      ])
      return res.render('search', { userSearchResult, q: name, topUsers })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
