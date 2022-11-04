const { Tweet, User, Like, sequelize } = require('../models')
const [subDescriptionLength] = [50]
const getAllTweets = () => Tweet.findAll({
  raw: true,
  nest: true,
  include: [User],
  order: [['createdAt', 'DESC']],
  attributes: {
    include: [[sequelize.fn('SUBSTRING', sequelize.col('description'), 0, subDescriptionLength), 'subDescriptionLength']]
  }
})

const deleteTweet = (id) => Tweet.destroy({ where: { id } })

const getAllUsers = () => User.findAll({
  where: {
    role: 'user'
  },
  include: [
    { model: Tweet, include: { model: Like, attributes: [] }, attributes: [] },
    { model: User, as: 'Followers', attributes: [], through: { attributes: [] } },
    { model: User, as: 'Followings', attributes: [], through: { attributes: [] } }
  ],
  attributes: [
    'name', 'account', 'avatar', 'cover',
    [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Tweets.id'))), 'tweetCount'],
    [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followers.id'))), 'followerCount'],
    [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followings.id'))), 'followingCount'],
    [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Tweets.Likes.id'))), 'likeCount']
  ],
  group: sequelize.col('User.id'),
  order: [[sequelize.col('tweetCount'), 'DESC']],
  nest: true,
  raw: true
})
module.exports = { getAllTweets, deleteTweet, getAllUsers }
