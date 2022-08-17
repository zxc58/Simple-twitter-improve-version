const http = require('http')
const app = require('./app')
const io = require('./socket/socket-io')
const logger = require('./helpers/winston')
//
const port = process.env.PORT
//
const server = http.createServer(app)
io.attach(server)
server.listen(port, () => logger.info('server starts at' + new Date().toISOString()))
