'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add altering commands here
    await queryInterface.renameColumn('Members', 'memberID', 'email');
    await queryInterface.addColumn('Members', 'userType', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    // Add reverting commands here
    await queryInterface.renameColumn('Members', 'email', 'memberID');
    await queryInterface.removeColumn('Members', 'userType');
  }
};
