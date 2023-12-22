
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Matiere = sequelize.define('Matiere', {
  nomMatiere: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  niveau: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parcours: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coefficient: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  poids: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  id_enseignant: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  creditsEC: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  semestre: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
  // ... autres colonnes
});

module.exports = Matiere;