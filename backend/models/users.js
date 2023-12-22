
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const User = sequelize.define('User', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenoms: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  niveau : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  matricule : {
    type : DataTypes.STRING,
    allowNull : false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  parcours : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  // ... autres colonnes
});

module.exports = User;