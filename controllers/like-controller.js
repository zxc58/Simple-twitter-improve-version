const { likeServices, tweetServices } = require('../services')
const logger = require('../helpers/winston')

const likeController = {
  likeTweet: async (req, res) => {
    try {
      const tweet = await tweetServices.getTweet(req)
      if (!tweet) { return res.status(400).json({ status: false, message: 'This tweet id do not exist' }) }
      await likeServices.postLike(req)
      return res.status(302).json({ status: true, message: 'Post like successfully' })
    } catch (error) {
      logger.error('Time: ' + new Date().toISOString() + '\n' + error)
      res.status(500).json({ status: false, message: 'Server error' })
    }
  },
  unlikeTweet: async (req, res) => {
    try {
      const result = await likeServices.deleteLike(req)
      if (!result) { return res.status(400).json({ status: false, message: 'This tweet id do not exist' }) }
      return res.status(302).json({ status: true, message: 'Delete like successfully' })
    } catch (error) {
      logger.error('Time: ' + new Date().toISOString() + '\n' + error)
      res.status(500).json({ status: false, message: 'Server error' })
    }
  }
}

module.exports = likeController
