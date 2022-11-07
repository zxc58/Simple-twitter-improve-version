const { replyServices, userServices, tweetServices } = require('../services')

const replyController = {
  getReplies: async (req, res, next) => {
    try {
      const [tweet, topUsers, replies] = await Promise.all([
        tweetServices.getTweet(req),
        userServices.getTopUsers(req),
        replyServices.getTweetReply(req)
      ])
      if (!tweet) { throw new Error('This tweet id do not exist') }
      return res.render('tweet', { tweet: tweet.toJSON(), topUsers, replies })
    } catch (error) {
      next(error)
    }
  },

  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      if (!(comment.length <= 140)) { throw new Error('String length exceeds range') }
      const tweet = await tweetServices.getTweet(req)
      if (!tweet) { throw new Error('This tweet id do not exist') }
      await replyServices.reply(req)
      return res.redirect(`${req.get('Referrer')}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = replyController
