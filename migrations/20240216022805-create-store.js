'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name_en: {
        allowNull: false,
        type: Sequelize.STRING
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING
      },
      image: {
        allowNull: false,
        type: Sequelize.STRING
      },
      location: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      google_map: {
        allowNull: false,
        type: Sequelize.STRING
      },
      rating: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stores');
  }
};