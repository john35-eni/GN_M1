// routes/users.js

const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

// Route pour récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des utilisateurs.' });
  }
});

// Route pour mettre à jour un utilisateur par son ID
/* router.put('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUserData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        // ... autres propriétés que vous souhaitez mettre à jour
      };

      const updatedUser = await userService.updateUser(userId, updatedUserData);
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.' });
    }
  }); */

  // Route pour mettre à jour etudiant par son ID

  router.put('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUserData = {
        nom: req.body.nom,
        prenoms: req.body.prenoms,
        niveau: req.body.niveau,
        matricule: req.body.matricule,
        email: req.body.email,
        parcours: req.body.parcours,
        role: req.body.role,
        //password: req.body.password,
        // ... autres propriétés que vous souhaitez mettre à jour
      };

      const updatedUser = await userService.updateUser(userId, updatedUserData);
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.' });
    }
  });

  // routes/users.js

// ...

// Route pour supprimer un utilisateur par son ID
router.delete('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Vous devez implémenter la fonction `deleteUser` dans votre `userService`
      const result = await userService.deleteUser(userId);
  
      if (result === 1) {
        res.json({ message: 'Utilisateur supprimé avec succès.' });
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'utilisateur.' });
    }
  });
  
  // Route pour créer un nouvel utilisateur
router.post('/register', async (req, res) => {
  try {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role : req.body.role,
      // ... autres propriétés de l'utilisateur
    };

    const newUser = await userService.createUser(userData);

    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'utilisateur.' });
  }
});

  // Route pour créer un nouvel etudiant
  router.post('/users', async (req, res) => {
    try {
      const userData = {
        nom: req.body.nom,
        prenoms: req.body.prenoms,
        niveau: req.body.niveau,
        matricule: req.body.matricule,
        email: req.body.email,
        parcours: req.body.parcours,
        //password: req.body.password,
        role : req.body.role,
        // ... autres propriétés de l'utilisateur
      };
  
      const newUser = await userService.createUser(userData);
  
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'utilisateur.' });
    }
  });
  
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);
    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Incorrect email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/logout', async (req, res) => {
  const userId = req.user.id; // Obtenez l'ID de l'utilisateur à partir du jeton
  const tokenToRevoke = req.headers.authorization.replace('Bearer ', ''); // Obtenez le jeton à révoquer depuis l'en-tête

  try {
    const result = await userService.logoutUser(userId, tokenToRevoke);

    if (result === 'Jeton révoqué avec succès.') {
      res.json({ message: 'Déconnexion réussie' });
    } else {
      res.status(401).json({ message: 'Impossible de révoquer le jeton' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la révocation du jeton', error: error.message });
  }
});

module.exports = router;
