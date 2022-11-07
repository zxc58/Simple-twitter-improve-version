const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Message } = require('../models')
const logger = require('../helpers/winston')

passport.use(new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password',
  passReqToCallback: true
},
async (req, account, password, done) => {
  try {
    const isUserMatch = await User.findOne({ where: { account } })
    if (!isUserMatch) { return done(null, false, req.flash('error_messages', '帳號不存在')) }
    const user = isUserMatch.toJSON()
    const isPasswordMatch = bcrypt.compareSync(password, user.password)
    if (!isPasswordMatch) { return done(null, false, req.flash('error_messages', '帳號或密碼錯誤')) }
    return done(null, user)
  } catch (error) {
    logger.error(new Date().toISOString() + ' : ' + error)
    return done(error)
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    let [user, hasNewMessage] = await Promise.all([
      User.findByPk(id),
      Message.findOne({ where: { receiverId: id, beenseen: 0 } })
    ])
    user = user.toJSON()
    user.notice = !!hasNewMessage
    return done(null, user)
  } catch (error) {
    logger.error(new Date().toISOString() + ' : ' + error)
    return done(error)
  }
})

module.exports = passport
