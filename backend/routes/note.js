// routes/matiere.js

const express = require('express');
const noteService = require('../services/noteService');

const router = express.Router();

// Route pour récupérer tous les notes
router.get('/notes', async (req, res) => {
  try {
    const notes = await noteService.getAllNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des notes.' });
  }
});

// Route pour récupérer les details de note pour chaque étudiant
router.get('/notesDetail/:idEtudiant/:niveauEtudiant', async (req, res) => {
  try {
    const data = {
      idEtudiant : req.params.idEtudiant,
      niveauEtudiant : req.params.niveauEtudiant,
    }
    const notes = await noteService.getNotesEtudiantAndMatiere(data.idEtudiant, data.niveauEtudiant);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des notes.' });
  }
});

// Route pour créer une note

router.post('/notes', async (req, res) => {
  try {
    const noteData = {
      idMatiere: req.body.idMatiere,
      valeurNote: req.body.valeurNote,
      idEtudiant: req.body.idEtudiant,
      niveau: req.body.niveau,
      rattrapage: req.body.rattrapage,
      // ... autres propriétés du note
    };

    const newNote = await noteService.createNote(noteData);

    res.json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de la note.' });
  }
});

// Route pour mettre à jour une note par son ID
router.put('/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    const updatedNoteData = {
      idMatiere: req.body.idMatiere,
      valeurNote: req.body.valeurNote,
      idEtudiant: req.body.idEtudiant,
      niveau: req.body.niveau,
      rattrapage: req.body.rattrapage,
      // ... autres propriétés de la note
    };

    const updatedNote = await noteService.updateNote(noteId, updatedNoteData);

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la note.' });
  }
});

// Route pour mettre à jour une note  rattrapage par son ID
router.put('/notesrattrapage/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    const updatedNoteData = {
      valeurNote: req.body.valeurNote,
      // ... autres propriétés de la note
    };

    const updatedNote = await noteService.updateNoteRattrapage(noteId, updatedNoteData);

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la note.' });
  }
});

// Route pour supprimer une note par son ID
router.delete('/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;

    const result = await noteService.deleteNote(noteId);

    if (result === 1) {
      res.json({ message: 'Note supprimé avec succès.' });
    } else {
      res.status(404).json({ error: 'Note non trouvé.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la note.' });
  }
});

module.exports = router;
