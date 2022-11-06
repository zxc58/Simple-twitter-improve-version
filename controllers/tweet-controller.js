const { tweetServices, userServices } = require('../services')
const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const [tweets, topUsers] = await Promise.all([
        tweetServices.getAllTweets(req),
        userServices.getTopUsers(req)
      ])
      const ids = JSON.stringify(tweets.map(e => e.id))
      return res.render('index', { tweets, topUsers, ids })
    } catch (error) {
      next(error)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const description = req.body.description
      if (!(description.length <= 140)) {
        req.flash('error_messages', 'String length exceeds range')
        return res.redirect('/tweets')
      }
      await tweetServices.postTweet(req)
      return res.redirect(`${req.get('Referrer')}`)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = tweetController
