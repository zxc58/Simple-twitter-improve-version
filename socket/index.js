const { Message } = require('../models')
const io = require('./setting/io')
io.on('connection', (socket) => {
  const { userId } = socket.handshake.query
  socket.userId = userId
  socket.on('privateMessage', async (message) => {
    try {
      const { id, avatar, name } = socket.request.user
      const sender = { id, avatar, name }
      Message.create(message)
      const sockets = await io.fetchSockets()
      const receiverSocketId = sockets.find(socket => socket.userId === message.receiverId)?.id
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit('privateMessage', message, sender)
        socket.to(receiverSocketId).emit('notify')
      }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('disconnect', async () => {
  })
})
module.exports = io
