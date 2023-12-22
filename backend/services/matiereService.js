const Matiere = require('../models/matieres');

async function getAllMatiere() {
    const matieres = await Matiere.findAll();
    return matieres;
  }

  async function createMatiere(matiereData) {
    try {
      const matiere = await Matiere.create(matiereData);
      return matiere;
    } catch (error) {
      throw error; // Gérer les erreurs en conséquence
    }
  }

 // Fonction pour mettre à jour un matière
async function updateMatiere(matiereId, updatedMatiereData) {
    try {
      const matiere = await Matiere.findByPk(matiereId);
  
      if (!matiere) {
        throw new Error('Matière non trouvé.');
      }
  
      // Mettez à jour les propriétés de la matière avec les nouvelles données
      matiere.nomMatiere = updatedMatiereData.nomMatiere;
      matiere.ue = updatedMatiereData.ue;
      matiere.niveau = updatedMatiereData.niveau;
      matiere.parcours = updatedMatiereData.parcours;
      matiere.coefficient = updatedMatiereData.coefficient;
      matiere.poids = updatedMatiereData.poids;
      matiere.id_enseignant = updatedMatiereData.id_enseignant;
      matiere.creditsEC = updatedMatiereData.creditsEC;
      matiere.semestre = updatedMatiereData.semestre;
      // ... mettez à jour les autres propriétés
  
      await matiere.save();
  
      return matiere;
    } catch (error) {
      throw error; // Gérer les erreurs en conséquence
    }
  } 

  async function deleteMatiere(matiereId) {
    try {
      const result = await Matiere.destroy({
        where: { id: matiereId },
      });
  
      return result; // Le nombre de lignes supprimées
    } catch (error) {
      throw error; // Gérer les erreurs en conséquence
    }
  }

  // fonction get matière by parcours
  async function getMatieresByParcoursAndNiveau(parcours, niveau) {
    try {
      const result = await Matiere.findAll({
        where: {
          parcours: parcours,
          niveau: niveau
        }
      });
  
      console.log(result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des matières:', error);
      throw error;
    }
  }

  module.exports = {
    getAllMatiere,
    createMatiere,
    updateMatiere,
    deleteMatiere,
    getMatieresByParcoursAndNiveau,
    // ... autres fonctions de service
  };