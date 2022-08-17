const { Server } = require('socket.io')
const { Message, User } = require('../models')
//

const io = new Server()
const sockets = {}
io.on('connection', async (socket) => {
  const { userId } = socket.handshake.query
  if ((!sockets[userId]) && userId) {
    socket.on('post message', async (message) => {
      const messageObject = JSON.parse(message)
      if (messageObject.senderId !== messageObject.receiverId) {
        Message.create(JSON.parse(message))
        const sender = await User.findByPk(Number(messageObject.senderId), { attributes: ['id', 'avatar', 'name'] })
        if (sockets[messageObject.receiverId]) {
          sockets[messageObject.receiverId].emit('get message', JSON.stringify({ message: messageObject, sender: sender.toJSON() }))
          sockets[messageObject.receiverId].emit('notify user', messageObject.senderId)
        }
      }
    })
    socket.on('disconnect', reason => {
      sockets[userId] = null
      delete sockets[userId]
    })
    sockets[userId] = socket
    socket = null
  }
})

//
module.exports = io
