/* eslint-disable no-unused-vars */
const { deleteFollowship } = require('../controllers/follow-controller')
const { User, Tweet, Like, Followship, sequelize } = require('../models')
const followshipSequelize = {
  postFollowship: (followerId, followingId) => Followship.findOrCreate({
    where: {
      followerId,
      followingId
    }
  }),

  deleteFollowship: (followerId, followingId) => Followship.destroy({
    where: {
      followerId,
      followingId
    }
  })
}
module.exports = followshipSequelize
