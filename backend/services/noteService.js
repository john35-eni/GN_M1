// services/noteService.js

const Note = require('../models/notes');
const User = require('../models/users');
const Matiere = require('../models/matieres');


Note.belongsTo(Matiere, { foreignKey: 'idMatiere' });
Note.belongsTo(User, { foreignKey: 'idEtudiant' });

Matiere.hasMany(Note, { foreignKey: 'idMatiere' });
User.hasMany(Note, { foreignKey: 'idEtudiant' });

async function getAllNotes() {
    const matieres = await Note.findAll();
    return matieres;
  }

async function createNote(noteData) {
  try {
    const note = await Note.create(noteData);
    return note;
  } catch (error) {
    throw error; // Gérer les erreurs en conséquence
  }
}

 // Fonction pour mettre à jour un matière
 async function updateNote(noteId, updatedNoteData) {
  try {
    const note = await Note.findByPk(noteId);

    if (!note) {
      throw new Error('Note non trouvé.');
    }

    // Mettre à jour les propriétés de la note avec les nouvelles données
    note.idMatiere = updatedNoteData.idMatiere;
    note.valeurNote = updatedNoteData.valeurNote;
    note.idEtudiant = updatedNoteData.idEtudiant;
    note.niveau = updatedNoteData.niveau;
    note.rattrapage = updatedNoteData.rattrapage;

    await note.save();

    return note;
  } catch (error) {
    throw error; // Gérer les erreurs en conséquence
  }
} 

async function deleteNote(noteId) {
  try {
    const result = await Note.destroy({
      where: { id: noteId },
    });

    return result; // Le nombre de lignes supprimées
  } catch (error) {
    throw error; // Gérer les erreurs en conséquence
  }
}

async function getNotesEtudiantAndMatiere(idEtudiant, niveauEtudiant) {
  try {
    const result = await Note.findAll({
      attributes: ['id', 'valeurNote', 'rattrapage'],
      where: {
        idEtudiant: idEtudiant,
        niveau: niveauEtudiant,
      },
      include: [
        {
          model: Matiere,
          attributes: ['id', 'nomMatiere', 'semestre', 'ue', 'poids', 'coefficient', 'creditsEC'],
        },
        {
          model: User,
          attributes: ['nom', 'prenoms', 'niveau'],
        //  where: { niveau: niveauEtudiant },
        },
      ],
    });
    return result;
  } catch (error) {
    throw error;
  }
}

 // Fonction pour mettre à jour un matière
 async function updateNoteRattrapage(noteId, updatedNoteData) {
  try {
    const note = await Note.findByPk(noteId);

    if (!note) {
      throw new Error('Note non trouvé.');
    }

    // Mettre à jour les propriétés de la note avec les nouvelles données
    note.valeurNote = updatedNoteData.valeurNote;

    await note.save();

    return note;
  } catch (error) {
    throw error; // Gérer les erreurs en conséquence
  }
}



module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  getNotesEtudiantAndMatiere,
  updateNoteRattrapage,
  // ... autres fonctions de service
};
