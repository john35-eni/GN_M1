'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idEtudiant: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      idMatiere: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      valeurNote: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      rattrapage: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      niveau: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      // ... autres colonnes si nécessaire
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Notes');
  }
};

