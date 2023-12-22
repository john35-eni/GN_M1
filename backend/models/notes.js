
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Note = sequelize.define('Note', {
  idEtudiant: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idMatiere: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valeurNote: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  rattrapage: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  niveau: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // ... autres colonnes
});

module.exports = Note;