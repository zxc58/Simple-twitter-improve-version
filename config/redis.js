const redis = require('redis')
const client = redis.createClient()
client.on('connect', () => {
  console.log('Redis client connected')
})
client.on('error', () => { console.error('redis on error') })

client.connect()

module.exports = client
