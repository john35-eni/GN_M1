import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import EditComponentNoteRattrapage from "./editNoteRattrapage";
import axiosInstance from "../../service/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";

const commonCellStyle = {
  border: "1px solid rgba(224, 224, 224, 1)",
  padding: 8,
};

export const NoteParNiveau = (props) => {
  const [backendData, setBackendData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [props.niveau]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/notesDetail/${props.id}/${props.niveau}`);
      const donne = res.data;
      setBackendData(donne);
    } catch (error) {
      console.error(error);
      Swal.fire("Erreur", error.toString(), "error");
    } finally {
      setLoading(false);
    }
  };

  // Group data by UE
  const groupedData = backendData.reduce((acc, current) => {
    const key = current.Matiere.ue;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(current);
    return acc;
  }, {});

  const calculateGeneralAverage = () => {
    const ueAverages = Object.values(groupedData).map((elements) => {
      const uniqueMatiereIds = Array.from(new Set(elements.map((el) => el.Matiere.id)));

      const ueNotes = uniqueMatiereIds.map((matiereId) =>
        Math.max(
          ...elements.filter((el) => el.Matiere.id === matiereId).map((el) => el.valeurNote)
        )
      );

      return calculateUEAverage(ueNotes);
    });

    return calculateAverage(ueAverages);
  };

  const calculateAverage = (notes) => {
    if (notes.length === 0) {
      return 0;
    }
    const sum = notes.reduce((acc, note) => acc + note, 0);
    return sum / notes.length;
  };

  const calculateUEAverage = (notes) => {
    if (notes.length === 0) {
      return 0;
    }
    const sum = notes.reduce((acc, note) => acc + note, 0);
    return sum / notes.length;
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text(`Relevé des notes en ${props.niveau}`, 10, 10);

    doc.text(`Nom: ${props.nom}`, 14, 30);
    doc.text(`Prenoms: ${props.prenoms}`, 14, 40);
    doc.text(`Niveau: ${props.niveau}`, 14, 50);
    doc.text(`Matricule: ${props.matricule}`, 14, 60);
    doc.text(`Parcours: ${props.parcours}`, 14, 70);

    const tableData = [];

    Object.entries(groupedData).forEach(([ue, elements]) => {
      const uniqueMatiereIds = Array.from(new Set(elements.map((el) => el.Matiere.id)));

      uniqueMatiereIds.forEach((matiereId, index) => {
        const matiereElements = elements.filter((el) => el.Matiere.id === matiereId);
        const sessionNormalNote = matiereElements.find((el) => !el.rattrapage);
        const sessionRattrapageNote = matiereElements.find((el) => el.rattrapage);

        tableData.push({
          UE: index === 0 ? ue : "",
          Element_constitutif: matiereElements[0].Matiere.nomMatiere,
          Semestre: matiereElements[0].Matiere.semestre,
          Poids: matiereElements[0].Matiere.poids,
          Coefficient: matiereElements[0].Matiere.coefficient,
          Credits: matiereElements[0].Matiere.creditsEC,
          Session_Normal: sessionNormalNote ? sessionNormalNote.valeurNote : "",
          Session_Rattrapage: sessionRattrapageNote ? sessionRattrapageNote.valeurNote : "",
          Note: sessionNormalNote && sessionRattrapageNote
            ? Math.max(sessionNormalNote.valeurNote, sessionRattrapageNote.valeurNote)
            : sessionNormalNote
              ? sessionNormalNote.valeurNote
              : sessionRattrapageNote
                ? sessionRattrapageNote.valeurNote
                : "",
        });
      });

      tableData.push({
        UE: "Résultat",
        Element_constitutif: "",
        Semestre: "",
        Poids: "",
        Coefficient: "",
        Credits: "",
        Session_Normal: "",
        Session_Rattrapage: "",
        Note: determineResultat(
          uniqueMatiereIds.map((id) =>
            Math.max(
              ...elements.filter((el) => el.Matiere.id === id).map((el) => el.valeurNote)
            )
          )
        ),
      });

      tableData.push({
        UE: "Moyenne",
        Element_constitutif: "",
        Semestre: "",
        Poids: "",
        Coefficient: "",
        Credits: "",
        Session_Normal: "",
        Session_Rattrapage: "",
        Note: calculateUEAverage(
          uniqueMatiereIds.map((id) =>
            Math.max(
              ...elements.filter((el) => el.Matiere.id === id).map((el) => el.valeurNote)
            )
          )
        ).toFixed(2),
      });
    });

    const columns = [
      { header: "UE", dataKey: "UE" },
      { header: "Element constitutif", dataKey: "Element_constitutif" },
      { header: "Semestre", dataKey: "Semestre" },
      { header: "Poids", dataKey: "Poids" },
      { header: "Coefficient", dataKey: "Coefficient" },
      { header: "Crédits", dataKey: "Credits" },
      { header: "Session Normal", dataKey: "Session_Normal" },
      { header: "Session Rattrapage", dataKey: "Session_Rattrapage" },
      { header: "Note", dataKey: "Note" },
    ];

    const options = {
      startY: 80, 
      theme: "grid",
    };

    doc.autoTable(columns, tableData, options);

    doc.text(`Résultat d'admission: ${determineAdmissionResult()}`, 14, doc.autoTable.previous.finalY + 20);

    doc.save(`releve_notes_${props.niveau}.pdf`);
  };

  const determineResultat = (notesUE) => {
    const isMoyenneValid = calculateAverage(notesUE) >= 10;
    const hasNoLowNotes = !notesUE.some((note) => note <= 5);

    if (isMoyenneValid && hasNoLowNotes) {
      return "VALIDE";
    }

    return "NON VALIDE";
  };

  const determineAdmissionResult = () => {
    const ueResults = Object.values(groupedData).map((elements) => {
      const uniqueMatiereIds = Array.from(new Set(elements.map((el) => el.Matiere.id)));
      const ueNotes = uniqueMatiereIds.map((matiereId) => {
        const matiereElements = elements.filter((el) => el.Matiere.id === matiereId);
        return Math.max(...matiereElements.map((el) => el.valeurNote));
      });

      return determineResultat(ueNotes) === "VALIDE";
    });

    return ueResults.every((isValid) => isValid) ? "Admis" : "Non admis";
  };

  const deleteNote = (id) => {
    axiosInstance
      .delete(`/notes/${id}`)
      .then(() => {
        Swal.fire("Supprimé!", "", "success");
        fetchNotes();
      })
      .catch((error) => {
        Swal.fire("Erreur", error.toString(), "error");
      });
  };

  function Supprimer(id) {
    Swal.fire({
      title: "Etes-vous sûre?",
      text: "Cette action est irreversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "Annuler",
      confirmButtonText: "Supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNote(id);
      }
    });
  }

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">

        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Relevé des notes en {props.niveau}
          </Typography>
        </Box>

        <Box>
          <IconButton color="secondary" onClick={generatePDF} aria-label="print-to-pdf">
            <DownloadIcon />
          </IconButton>
        </Box>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : backendData.length === 0 ? (
        <Typography variant="body1" align="center">
          Aucune donnée pour l'instant.
        </Typography>
      ) : (<>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "#0001" }}>
              <TableRow>
                <TableCell align="center" style={commonCellStyle}>
                  UE
                </TableCell>
                <TableCell align="center" style={commonCellStyle}>
                  Element constitutif
                </TableCell>
                <TableCell align="center" style={commonCellStyle}>
                  Semestre
                </TableCell>
                <TableCell align="center" style={commonCellStyle}>
                  Poids
                </TableCell>
                <TableCell align="center" style={commonCellStyle}>
                  Coefficient
                </TableCell>
                <TableCell align="center" style={commonCellStyle}>
                  Crédits
                </TableCell>
                <TableCell align="center" style={commonCellStyle}>
                  Session Normal
                </TableCell>
                <TableCell align="center" style={commonCellStyle}>
                  Session Rattrapage
                </TableCell>
                <TableCell align="center" style={commonCellStyle}>
                  Note
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedData).map(([ue, elements], ueIndex) => {
                const uniqueMatiereIds = Array.from(new Set(elements.map((el) => el.Matiere.id)));

                return (
                  <React.Fragment key={ueIndex}>
                    {uniqueMatiereIds.map((matiereId, index) => {
                      const matiereElements = elements.filter((el) => el.Matiere.id === matiereId);
                      const sessionNormalNote = matiereElements.find((el) => !el.rattrapage);
                      const sessionRattrapageNote = matiereElements.find((el) => el.rattrapage);

                      return (
                        <TableRow key={index}>
                          {index === 0 && (
                            <TableCell rowSpan={uniqueMatiereIds.length} align="center" style={commonCellStyle}>
                              {ue}
                            </TableCell>
                          )}
                          <TableCell align="center" style={commonCellStyle}>
                            {matiereElements[0].Matiere.nomMatiere}
                          </TableCell>
                          <TableCell align="center" style={commonCellStyle}>
                            {matiereElements[0].Matiere.semestre}
                          </TableCell>
                          <TableCell align="center" style={commonCellStyle}>
                            {matiereElements[0].Matiere.poids}
                          </TableCell>
                          <TableCell align="center" style={commonCellStyle}>
                            {matiereElements[0].Matiere.coefficient}
                          </TableCell>
                          <TableCell align="center" style={commonCellStyle}>
                            {matiereElements[0].Matiere.creditsEC}
                          </TableCell>
                          <TableCell align="center" style={commonCellStyle}>
                            {sessionNormalNote && sessionNormalNote.valeurNote ? (
                              <>
                                {sessionNormalNote.valeurNote}
                                <EditComponentNoteRattrapage
                                  note={sessionNormalNote.valeurNote}
                                  id={sessionNormalNote.id}
                                  fetch={fetchNotes}
                                />
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  color="error"
                                  onClick={() => Supprimer(sessionNormalNote.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              "" 
                            )}
                          </TableCell>

                          <TableCell align="center" style={commonCellStyle}>
                            {sessionRattrapageNote && (
                              <>
                                {sessionRattrapageNote.valeurNote}
                                <EditComponentNoteRattrapage note={sessionRattrapageNote.valeurNote} id={sessionRattrapageNote.id} fetch={fetchNotes} />
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  color="error"
                                  onClick={() => Supprimer(sessionRattrapageNote.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            )}
                          </TableCell>
                          <TableCell align="center" style={commonCellStyle}>
                            {sessionNormalNote && sessionRattrapageNote
                              ? Math.max(sessionNormalNote.valeurNote, sessionRattrapageNote.valeurNote)
                              : sessionNormalNote
                                ? sessionNormalNote.valeurNote
                                : sessionRattrapageNote
                                  ? sessionRattrapageNote.valeurNote
                                  : ""}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    <TableRow>
                      <TableCell align="center" style={commonCellStyle}>
                        Résultat {ue}
                      </TableCell>
                      <TableCell colSpan={7} align="center" style={commonCellStyle}></TableCell>
                      <TableCell align="center" style={commonCellStyle}>
                        {determineResultat(
                          uniqueMatiereIds.map((id) =>
                            Math.max(
                              ...elements.filter((el) => el.Matiere.id === id).map((el) => el.valeurNote)
                            )
                          )
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center" style={commonCellStyle}>
                        Moyenne {ue}
                      </TableCell>
                      <TableCell colSpan={7} align="center" style={commonCellStyle}></TableCell>
                      <TableCell align="center" style={commonCellStyle}>
                        {calculateUEAverage(
                          uniqueMatiereIds.map((id) =>
                            Math.max(
                              ...elements.filter((el) => el.Matiere.id === id).map((el) => el.valeurNote)
                            )
                          )
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
              <TableRow>
                <TableCell align="center" style={commonCellStyle}>
                  Moyenne
                </TableCell>
                <TableCell colSpan={7} align="center" style={commonCellStyle}></TableCell>
                <TableCell align="center" style={commonCellStyle}>
                  {calculateGeneralAverage().toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <Typography variant="body2" align="center" gutterBottom>
          Résultat d'admission : {determineAdmissionResult()}
        </Typography>
      </>
      )}
      <Box>
        <Typography variant="body2" align="right" gutterBottom>
          Etudiant(e) :  {props.nom} &nbsp; {props.prenoms} &nbsp; {props.niveau} &nbsp; {props.matricule}
        </Typography>
      </Box>
    </>
  );
};
