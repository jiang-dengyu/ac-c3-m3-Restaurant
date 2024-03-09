'use strict'
const json = require('../public/jsons/restaurant.json')
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction
    try {
      transaction = await queryInterface.sequelize.transaction()

      const hash = await bcrypt.hash('12345678', 10)

      await queryInterface.bulkInsert(
        'Users',
        [
          {
            id: 1,
            name: 'user1',
            email: 'user1@example.com',
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            name: 'user2',
            email: 'user2@example.com',
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        { transaction }
      )
      const newArray = json.results.map((item, index) => {
        let userId = [1, 2, 3, 4].includes(index + 1) ? 1 : 2
        return {
          name: `${item.name}`,
          name_en: `${item.name_en}`,
          category: `${item.category}`,
          image: `${item.image}`,
          location: `${item.location}`,
          phone: `${item.phone}`,
          google_map: `${item.google_map}`,
          rating: `${item.rating}`,
          description: `${item.description}`,
          userId: `${userId}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      await queryInterface.bulkInsert('stores', newArray, { transaction })

      await transaction.commit()
    } catch (error) {
      if (transaction) await transaction.rollback()
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
}
