const { gettweet } = require('../sequelize/tweet-sequelize')
const { postLike, deleteLike } = require('../sequelize/like-sequelize')
const helpers = require('../_helpers')
const logger = require('../helpers/winston')

const likeController = {
  likeTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = Number(req.params.id)
      const tweet = await gettweet(tweetId)
      if (!tweet) { return res.status(400).json({ status: false, message: 'This tweet id do not exist' }) }
      await postLike(userId, tweetId)
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
      const result = await deleteLike(userId, tweetId)
      if (!result) { return res.status(400).json({ status: false, message: 'This tweet id do not exist' }) }
      return res.status(302).json({ status: true, message: 'Delete like successfully' })
    } catch (error) {
      logger.error('Time: ' + new Date().toISOString() + '\n' + error)
      res.status(500).json({ status: false, message: 'Server error' })
    }
  }
}

module.exports = likeController
