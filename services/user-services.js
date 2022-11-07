const bcrypt = require('bcryptjs')
const { User, Tweet, Like, Message, sequelize, Sequelize } = require('../models')
const { Op } = Sequelize
const helpers = require('../_helpers')
const [topUsersQuantity] = [5]
const userSequelize = {
  getAllUsers: (req) => {
    return User.findAll({
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
  },

  getPersonalData: (req) => {
    const id = Number(req.params.id) || helpers.getUser(req).id
    const myId = helpers.getUser(req).id
    return User.findByPk(id, {
      include: [
        { model: User, as: 'Followings', duplicating: false, through: { attributes: [] }, attributes: [] },
        { model: User, as: 'Followers', duplicating: false, through: { attributes: [] }, attributes: [] },
        { model: Tweet, attributes: [] }
      ],
      attributes: [
        'id', 'name', 'email', 'avatar', 'account', 'cover', 'introduction', 'role',
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followings.id'))), 'followingsCount'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followers.id'))), 'followersCount'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Tweets.id'))), 'tweetsCount'],
        [sequelize.fn('MAX', sequelize.fn('IF', sequelize.literal('`Followers`.`id`-' + myId + '=0'), 1, 0)), 'isFollowed']
      ]
    })
  },

  getFollowers: (req) => {
    const UserId = Number(req.params.id)
    return User.findByPk(UserId, {
      include: [
        Tweet,
        { model: User, as: 'Followers', include: { model: User, as: 'Followers' } }
      ],
      order: [[sequelize.col('Followers.Followship.createdAt'), 'DESC']]
    })
  },

  getFollowings: (req) => {
    const UserId = Number(req.params.id)
    return User.findByPk(UserId, {
      include: [
        Tweet,
        { model: User, as: 'Followings', include: { model: User, as: 'Followers' } }
      ],
      order: [[sequelize.col('Followings.Followship.createdAt'), 'DESC']]
    })
  },

  getChatUsers: (req) => {
    const { id } = helpers.getUser(req)
    return User.findAll({
      where: {
        [Op.or]: [sequelize.where(sequelize.col('sentMessages.receiverId'), id), sequelize.where(sequelize.col('receivedMessages.senderId'), id)]
      },
      include: [
        { model: Message, as: 'sentMessages', where: { receiverId: id }, required: false, order: [[sequelize.col('sentMessages.createdAt'), 'DESC']] },
        { model: Message, as: 'receivedMessages', where: { senderId: id }, required: false, order: [[sequelize.col('receivedMessages.createdAt'), 'DESC']] }
      ],
      group: sequelize.col('User.id'),
      raw: true,
      nest: true
    })
  },

  getTopUsers: (req) => {
    const { id } = helpers.getUser(req)
    return User.findAll({
      where: {
        id: { [Op.ne]: id }, role: 'user'
      },
      include: {
        model: User,
        as: 'Followers',
        attributes: [],
        duplicating: false,
        through: {
          attributes: []
        }
      },
      attributes: ['id', 'name', 'account', 'avatar',
        [sequelize.fn('COUNT', sequelize.col('Followers.id')), 'totalFollower'],
        [sequelize.fn('MAX', sequelize.fn('IF', sequelize.literal('`Followers`.`id` - ' + id + ' = 0'), 1, 0)), 'isFollowed']
      ],
      group: 'id',
      order: [[sequelize.col('totalFollower'), 'DESC']],
      limit: topUsersQuantity,
      raw: true,
      nest: true
    })
  },

  checkDuplicates: (req) => {
    const { account, email } = req.body
    const { id } = helpers.getUser(req)
    return User.findOne({
      where: {
        id: { [Op.ne]: id || -1 },
        [Op.or]: [{ account }, { email }]
      }
    })
  },

  searchUsers: (req) => {
    const name = req.query.q
    const { id } = helpers.getUser(req)
    return User.findAll({
      where: { name: { [Op.regexp]: name }, role: 'user', id: { [Op.ne]: id } },
      include: {
        model: User,
        as: 'Followers',
        attributes: [],
        duplicating: false,
        through: {
          attributes: []
        }
      },
      attributes: ['id', 'name', 'account', 'avatar', 'introduction',
        [sequelize.fn('MAX', sequelize.fn('IF', sequelize.literal('`Followers`.`id` - ' + id + ' = 0'), 1, 0)), 'isFollowed']
      ],
      group: 'id',
      raw: true,
      nest: true
    })
  },

  postUser: (req) => {
    const { account, name, email, password } = req.body
    const hash = bcrypt.hashSync(password)
    return User.create({
      account,
      name,
      email,
      password: hash,
      avatar: 'https://www.teepr.com/wp-content/uploads/2018/01/medish.jpg',
      cover: 'https://storage.inewsdb.com/7a4fac5af8d264b429ce19d9d1c49281.jpg',
      role: 'user'
    })
  },

  putUser: (req) => {
    const { account, name, email, password } = req.body
    const hash = bcrypt.hashSync(password)
    const { id } = helpers.getUser(req)
    return User.update({
      account,
      name,
      email,
      password: hash
    }, {
      where: { id }
    })
  }
}
module.exports = userSequelize
