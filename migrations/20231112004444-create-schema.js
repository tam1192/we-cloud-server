'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schemas', {
      id: {
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        type: Sequelize.INTEGER
      },
      useruuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      schemaname: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      /**
      schemapath: {
        allowNull: false,
        type: Sequelize.STRING
      },
      */
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
    await queryInterface.dropTable('schemas');
  }
};