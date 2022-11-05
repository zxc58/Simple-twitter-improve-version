const { getTweetReply, reply } = require('../sequelize/reply-sequelize')
const { getTweet } = require('../sequelize/tweet-sequelize')
const { getTopUsers } = require('../sequelize/user-sequelize')
const helpers = require('../_helpers')

const replyController = {
  getReplies: async (req, res, next) => {
    try {
      const TweetId = Number(req.params.id)
      const userId = helpers.getUser(req).id
      const [tweet, topUsers, replies] = await Promise.all([
        getTweet(TweetId, userId),
        getTopUsers(userId),
        getTweetReply(TweetId)
      ])
      if (!tweet) { throw new Error('This tweet id do not exist') }
      return res.render('tweet', { tweet: tweet.toJSON(), topUsers, replies })
    } catch (error) {
      next(error)
    }
  },

  postReply: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = Number(req.params.id)
      const { comment } = req.body
      if (!(comment.length <= 140)) { throw new Error('String length exceeds range') }
      const tweet = await getTweet(tweetId, userId)
      if (!tweet) { throw new Error('This tweet id do not exist') }
      await reply(tweetId, userId, comment)
      return res.redirect(`${req.get('Referrer')}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = replyController
