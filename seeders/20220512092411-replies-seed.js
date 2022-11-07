'use strict'
const faker = require('faker')
const userIdsQueryString = "SELECT `id` FROM `Users`WHERE role='user';"
const tweetIdsQueryString = 'SELECT `id` FROM `Tweets`;'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [userIds, tweetIds] = await Promise.all([
      queryInterface.sequelize.query(
        userIdsQueryString,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ), queryInterface.sequelize.query(
        tweetIdsQueryString,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: tweetIds.length * 3 }, (element, index) => ({
        comment: faker.lorem.text().slice(0, 139),
        UserId: userIds[Math.floor(userIds.length * Math.random())].id,
        TweetId: tweetIds[index % tweetIds.length].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      , {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
}
