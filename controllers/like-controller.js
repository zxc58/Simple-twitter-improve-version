const { likeServices, tweetServices } = require('../services')
const helpers = require('../_helpers')
const logger = require('../helpers/winston')

const likeController = {
  likeTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = Number(req.params.id)
      const tweet = await tweetServices.getTweet(tweetId)
      if (!tweet) { return res.status(400).json({ status: false, message: 'This tweet id do not exist' }) }
      await likeServices.postLike(userId, tweetId)
      return res.status(302).json({ status: true, message: 'Post like successfully' })
    } catch (error) {
      logger.error('Time: ' + new Date().toISOString() + '\n' + error)
      res.status(500).json({ status: false, message: 'Server error' })
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = Number(req.params.id)
      const result = await likeServices.deleteLike(userId, tweetId)
      if (!result) { return res.status(400).json({ status: false, message: 'This tweet id do not exist' }) }
      return res.status(302).json({ status: true, message: 'Delete like successfully' })
    } catch (error) {
      logger.error('Time: ' + new Date().toISOString() + '\n' + error)
      res.status(500).json({ status: false, message: 'Server error' })
    }
  }
}

module.exports = likeController
