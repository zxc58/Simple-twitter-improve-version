/* eslint-disable no-unused-vars */
const { User, Tweet, Like, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')
const followshipSequelize = {
  follow: (req) => {
    const followingId = Number(req.body.id)
    const followerId = helpers.getUser(req).id
    return Followship.findOrCreate({
      where: { followerId, followingId }
    })
  },

  unfollow: (req) => {
    const followingId = Number(req.params.id)
    const followerId = helpers.getUser(req).id
    return Followship.destroy({
      where: { followerId, followingId }
    })
  }
}
module.exports = followshipSequelize
