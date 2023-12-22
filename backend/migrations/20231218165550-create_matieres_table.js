'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Matieres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nomMatiere: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ue: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      niveau: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      parcours: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coefficient: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      poids: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      id_enseignant: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      creditsEC: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      semestre: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Matieres');
  }
};