const { Server } = require('socket.io')
const io = new Server()
const passport = require('../../config/passport')
const sessionMiddleware = require('../../config/session')
//
const wrap = expressMiddleware => (socket, next) => expressMiddleware(socket.request, {}, next)
//
io.use(wrap(sessionMiddleware))
io.use(wrap(passport.initialize()))
io.use(wrap(passport.session()))
io.use((socket, next) => {
  if (socket.request.user) {
    next()
  } else {
    next(new Error('unauthorized'))
  }
})
//
module.exports = io
