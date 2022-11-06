const { tweetServices } = require('../services')
const { catchTopUsers } = require('../helpers/sequelize-helper')
const helpers = require('../_helpers')
const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const limit = Number(req.query.limit) || 20
      const [tweets, topUsers] = await Promise.all([
        tweetServices.getAllTweets(userId),
        catchTopUsers(req)
      ])
      const ids = JSON.stringify(tweets.map(e => e.id))
      return res.render('index', { tweets, topUsers, ids })
    } catch (error) {
      next(error)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const description = req.body.description
      if (!(description.length <= 140)) {
        req.flash('error_messages', 'String length exceeds range')
        return res.redirect('/tweets')
      }
      await tweetServices.postTweet(UserId, description)
      return res.redirect(`${req.get('Referrer')}`)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = tweetController
