const http = require('http')
const app = require('./app')
const mountSocket = require('./socket/socket-io')
const port = process.env.PORT
//
const server = http.createServer(app)
mountSocket(server)
server.listen(port, () => console.log('server start now'))
