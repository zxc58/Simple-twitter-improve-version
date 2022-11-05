const { getPersonalData } = require('../sequelize/user-sequelize')
const { follow, unfollow } = require('../sequelize/followship-sequelize')

const helpers = require('../_helpers')
const followshipController = {
  postFollowship: async (req, res, next) => {
    try {
      const followingId = Number(req.body.id)
      const followerId = helpers.getUser(req).id
      if (followingId === followerId) { throw new Error('Following id = follower id') }
      const following = await getPersonalData(followingId)
      if (!following) { throw new Error('This user id do not exist') }
      await follow(followerId, followingId)
      return res.redirect(`${req.get('Referrer')}`)
    } catch (error) {
      next(error)
    }
  },

  deleteFollowship: async (req, res, next) => {
    try {
      const followingId = Number(req.params.id)
      const followerId = helpers.getUser(req).id
      const result = await unfollow(followerId, followingId)
      if (!result) { throw new Error('Followship do not exsit') }
      return res.redirect(`${req.get('Referrer')}`)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = followshipController
