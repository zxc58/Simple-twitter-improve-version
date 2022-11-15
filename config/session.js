const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const logger = require('../helpers/winston')
//
const expireTime = 86400 * 1000
const sessionSecret = process.env.SESSION_SECRET
const redisClient = redis.createClient({
  url: process.env.REDIS_CONNECT_STRING || 'redis://localhost:6379',
  legacyMode: true
})
redisClient.on('connect', () => { logger.info('Redis client connected') })
redisClient.on('error', () => { logger.error('redis on error') })
redisClient.connect()
const sessionConfiguration = session({
  cookie: { maxAge: expireTime },
  store: new RedisStore({ client: redisClient }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
})
//
module.exports = sessionConfiguration
