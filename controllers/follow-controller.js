const { followshipServices, userServices } = require('../services')
const helpers = require('../_helpers')
const followshipController = {
  postFollowship: async (req, res, next) => {
    try {
      const followingId = Number(req.body.id)
      const followerId = helpers.getUser(req).id
      if (followingId === followerId) { throw new Error('Following id = follower id') }
      const following = await userServices.getPersonalData(req)
      if (!following) { throw new Error('This user id do not exist') }
      await followshipServices.follow(req)
      return res.redirect(`${req.get('Referrer')}`)
    } catch (error) {
      next(error)
    }
  },

  deleteFollowship: async (req, res, next) => {
    try {
      const result = await followshipServices.unfollow(req)
      if (!result) { throw new Error('Followship do not exsit') }
      return res.redirect(`${req.get('Referrer')}`)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = followshipController
