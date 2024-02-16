'use strict';
const json = require('../public/jsons/restaurant.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const newArray  = json.results.map((item)=>
    {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
    await queryInterface.bulkInsert('stores',newArray)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('stores', null)
  }
};
