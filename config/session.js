const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redisClient = require('./redis')
const sessionSecret = process.env.SESSION_SECRET

const sessionConfiguration = session({
  cookie: { maxAge: 86400000 },
  store: new RedisStore({ client: redisClient }),
  // store: new MemoryStore({
  //   checkPeriod: 86400000 // prune expired entries every 24h
  // }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
})

module.exports = sessionConfiguration
