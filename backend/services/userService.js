// services/userService.js

const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
//const RevokedToken = require('../models/revokedtoken'); // Modèle pour stocker les jetons révoqués
const TOKEN_EXPIRATION = '1h';
dotenv.config();

const secretKey = process.env.SECRET_KEY;

// Exemple de requête pour récupérer tous les utilisateurs
async function getAllUsers() {
  const users = await User.findAll();
  return users;
}

/* async function createUser(userData) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const modifiedUserData = { ...userData, password: hashedPassword };
    const user = await User.create(modifiedUserData);
    return user;
  } catch (error) {
    throw error; // Gérer les erreurs en conséquence
  }
} */

async function createUser(userData) {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw error; // Gérer les erreurs en conséquence
  }
}



// fonction pour authentifier user

async function loginUser (email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return null;
  }
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: TOKEN_EXPIRATION });
    return token;
  }
  return null;
}

// Fonction pour mettre à jour un utilisateur
async function updateUser(userId, updatedUserData) {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('Utilisateur non trouvé.');
    }

    // Mettez à jour les propriétés de l'utilisateur avec les nouvelles données
    user.nom = updatedUserData.nom;
    user.prenoms = updatedUserData.prenoms;
    user.niveau = updatedUserData.niveau;
    user.matricule = updatedUserData.matricule;
    user.email = updatedUserData.email;
    user.parcours = updatedUserData.parcours;
    user.role = updatedUserData.role;
    //user.password = updatedUserData.password;
    // ... mettez à jour les autres propriétés

    await user.save();

    return user;
  } catch (error) {
    throw error; // Gérer les erreurs en conséquence
  }
}

async function deleteUser(userId) {
  try {
    const result = await User.destroy({
      where: { id: userId },
    });

    return result; // Le nombre de lignes supprimées
  } catch (error) {
    throw error; // Gérer les erreurs en conséquence
  }
}



// Fonction pour révoquer un jeton JWT
/*async function logoutUser(userId, tokenToRevoke) {
  try {
    // Vérifier si le jeton à révoquer existe dans la base de données de jetons révoqués
    const isTokenRevoked = await RevokedToken.findOne({ where: { token: tokenToRevoke } });

    if (isTokenRevoked) {
      throw new Error('Le jeton a déjà été révoqué.');
    }

    // Vous pouvez également vérifier si le jeton appartient à l'utilisateur en utilisant userId

    // Si le jeton n'a pas été révoqué, ajoutez-le à la liste des jetons révoqués
    await RevokedToken.create({ userId, token: tokenToRevoke });

    return 'Jeton révoqué avec succès.';
  } catch (error) {
    throw error; // Gérer les erreurs en conséquence
  }
}*/



module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  //logoutUser,
  // ... autres fonctions de service
};
