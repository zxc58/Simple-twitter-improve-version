const { Message, User } = require('../models')
const io = require('./setting/io')
io.on('connection', (socket) => {
  const { userId } = socket.handshake.query
  socket.userId = userId
  socket.on('post message', async (message) => {
    try {
      const messageObject = JSON.parse(message)
      Message.create(JSON.parse(message))
      const [sender, sockets] = await Promise.all([
        User.findByPk(Number(messageObject.senderId), { attributes: ['id', 'avatar', 'name'] }),
        io.fetchSockets()
      ])
      const receiverSocketId = sockets.find(socket => socket.userId === messageObject.receiverId).id
      if (receiverSocketId) {
        socket.to(receiverSocketId).emit('get message', JSON.stringify({ message: messageObject, sender: sender.toJSON() }))
        socket.to(receiverSocketId).emit('notify user', messageObject.senderId)
      } else { console.log('he isnot online') }
    } catch (error) { console.log(error) }
  })

  socket.on('disconnect', async (reason) => {
  })
})
module.exports = io
