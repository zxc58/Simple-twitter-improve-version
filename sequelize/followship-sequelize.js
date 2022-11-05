/* eslint-disable no-unused-vars */
const { User, Tweet, Like, Followship, sequelize } = require('../models')
const followshipSequelize = {
  follow: (followerId, followingId) => Followship.findOrCreate({
    where: {
      followerId,
      followingId
    }
  }),

  unfollow: (followerId, followingId) => Followship.destroy({
    where: {
      followerId,
      followingId
    }
  })
}
module.exports = followshipSequelize
