// routes/matiere.js

const express = require('express');
const matiereService = require('../services/matiereService');

const router = express.Router();

// Route pour récupérer tous les matières
router.get('/matieres', async (req, res) => {
  try {
    const matieres = await matiereService.getAllMatiere();
    res.json(matieres);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des matières.' });
  }
});

//Route pour récupérer tous les matières par parcours et niveau

router.get('/matieres/:niveau/:parcours', async (req, res) => {
  try {
    const matiereNiveau = req.params.niveau;
    const matiereParcours = req.params.parcours;
    const matieres = await matiereService.getMatieresByParcoursAndNiveau(matiereParcours, matiereNiveau);
    res.json(matieres);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des matières.' });
  }
});


// Route pour mettre à jour une matière par son ID
router.put('/matieres/:id', async (req, res) => {
    try {
      const matiereId = req.params.id;
      const updatedMatiereData = {
        nomMatiere : req.body.nomMatiere,
        ue : req.body.ue,
        niveau : req.body.niveau,
        parcours : req.body.parcours,
        coefficient: req.body.coefficient,
        poids : req.body.poids,
        id_enseignant : req.body.id_enseignant,
        creditsEC : req.body.creditsEC,
        semestre : req.body.semestre,
      // ... autres propriétés de la matière
    }; 

      const updatedMatiere = await matiereService.updateMatiere(matiereId, updatedMatiereData);
  
      res.json(updatedMatiere);
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la matière.' });
    }
  });


// Route pour supprimer une matière par son ID
router.delete('/matieres/:id', async (req, res) => {
    try {
      const matiereId = req.params.id;
  
      // Vous devez implémenter la fonction `deleteUser` dans votre `userService`
      const result = await matiereService.deleteMatiere(matiereId);
  
      if (result === 1) {
        res.json({ message: 'Matière supprimé avec succès.' });
      } else {
        res.status(404).json({ error: 'Matière non trouvé.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la matière.' });
    }
  });
  
  // Route pour créer une nouvelle matière
router.post('/matieres', async (req, res) => {
  try {
    const matiereData = {
        nomMatiere : req.body.nomMatiere,
        ue : req.body.ue,
        niveau : req.body.niveau,
        parcours : req.body.parcours,
        coefficient: req.body.coefficient,
        poids : req.body.poids,
        id_enseignant : req.body.id_enseignant,
        creditsEC : req.body.creditsEC,
        semestre : req.body.semestre,
      // ... autres propriétés de la matière
    }; 


    const newMatiere = await matiereService.createMatiere(matiereData);

    res.json(newMatiere);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de la matière.' });
  }
});
  
module.exports = router;
