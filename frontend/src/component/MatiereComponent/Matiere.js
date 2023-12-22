import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../service/axios";
import {
    Box,
    Snackbar,
    Typography,
    Stack,
    Chip,
    Pagination,
    TextField,
    CircularProgress,
    Paper,
    IconButton,
    TableRow,
    TableHead,
    TableContainer,
    TableCell,
    TableBody,
    Table,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import MuiAlert from '@mui/material/Alert';
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import EditComponentMatiere from "./editMatiere";
import AddComponentMatiere from "./addMatiere";

export const Matiere = () => {
    const [matieres, setMatieres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingIds, setDeletingIds] = useState([]);
    const [filterNiveau, setFilterNiveau] = useState(""); // Set the initial state to an empty string or a default value
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortOrderParcours, setSortOrderParcours] = useState("asc");
    const [open, setOpen] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) {
            fetchMatiere(filterNiveau, searchText);
        } else {
            isMounted.current = true;
            fetchMatiere(null, searchText);
        }
    }, [filterNiveau, searchText, currentPage, rowsPerPage]);

    const fetchMatiere = async (filter = "", search = "") => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/matieres");
            const simulatedData = res.data;

            const filteredData = filter
                ? simulatedData.filter((item) => item.niveau === filter)
                : simulatedData;

            const searchData = search
                ? filteredData.filter((item) =>
                    Object.values(item)
                        .join(" ")
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
                : filteredData;

            setTotalItems(searchData.length);

            const newTotalPages = Math.ceil(searchData.length / rowsPerPage);
            const newCurrentPage = Math.min(currentPage, newTotalPages);
            const startIndex = (newCurrentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const paginatedData = searchData.slice(startIndex, endIndex);

            setMatieres(paginatedData);
            setCurrentPage(newCurrentPage);
            setTotalPages(newTotalPages);
        } catch (error) {
            console.error(error);
            Swal.fire("Erreur", error.toString(), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleClick = (event, Niveau) => {
        event.preventDefault();
        setFilterNiveau(Niveau);
        setCurrentPage(1); // Reset page when a filter is applied
        setSearchText("");
    };

    const deleteMatiere = (id) => {
        setDeletingIds((prevIds) => [...prevIds, id]);

        axiosInstance
            .delete(`/matieres/${id}`)
            .then(() => {
                //Swal.fire("Supprimé!", "", "success");
                setOpen(true);
                setDeletingIds((prevIds) => prevIds.filter((prevId) => prevId !== id));
                setMatieres((prevmatieres) => prevmatieres.filter((matiere) => matiere.id !== id));
            })
            .catch((error) => {
                Swal.fire("Erreur", error.toString(), "error");
                setDeletingIds((prevIds) => prevIds.filter((prevId) => prevId !== id));
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
                deleteMatiere(id);
            }
        });
    }

    const generatePdf = () => {
        const unit = "mm";
        const size = "A4";
        const orientation = "portrait";

        const doc = new jsPDF(orientation, unit, size);

        doc.text("Liste des matières", 10, 10);

        const tableData = matieres.map((matiere) => [
            matiere.id,
            matiere.ue,
            matiere.nomMatiere,
            matiere.niveau,
            matiere.coefficient,
            matiere.poids,
            matiere.parcours,
            matiere.semestre,
            matiere.creditsEC,
        ]);

        doc.autoTable({
            head: [["ID", "ue", "NomMatiere", "Niveau", "Coefficient", "Poids", "Parcours", "Semestre", "CréditsEC"]],
            body: tableData,
        });

        doc.save("matieres.pdf");
    };
    const handleSearchChange = (event) => {
        const newSearchText = event.target.value;
        setSearchText(newSearchText);

        // Reset data when search text is cleared
        if (newSearchText === "") {
            fetchMatiere(filterNiveau, ""); // Pass an empty string for search
        }
    };

    // sorting table by ue

    const handleSort = () => {
        // Toggle between ascending and descending order
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);

        // Implement sorting logic based on the order (asc or desc)
        const sortedmatieres = [...matieres];
        sortedmatieres.sort((a, b) => {
            const ueA = a.ue.toLowerCase();
            const ueB = b.ue.toLowerCase();
            return newSortOrder === "asc" ? ueA.localeCompare(ueB) : ueB.localeCompare(ueA);
        });

        setMatieres(sortedmatieres);
    };

    const handleSortParcours = () => {
        // Toggle between ascending and descending order
        const newSortOrderParcours = sortOrderParcours === "asc" ? "desc" : "asc";
        setSortOrderParcours(newSortOrderParcours);

        // Implement sorting logic based on the order (asc or desc)
        const sortedmatieres = [...matieres];
        sortedmatieres.sort((a, b) => {
            const parcoursA = a.parcours.toLowerCase(); // Ajuster ici
            const parcoursB = b.parcours.toLowerCase(); // Ajuster ici
            return newSortOrderParcours === "asc" ? parcoursA.localeCompare(parcoursB) : parcoursB.localeCompare(parcoursA);
        });

        setMatieres(sortedmatieres);
    };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    //fr
    return (
        <Box component="main" sx={{ p: 3 }}>
            <br />
            <br />
            <br />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Suppression avec succès
                </Alert>
            </Snackbar>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <AddComponentMatiere matieres={matieres} setMatieres={setMatieres} />
                <div role="presentation">
                    <Stack direction="row" spacing={1}>
                        {["L1", "L2", "L3", "M1", "M2"].map((niveau) => (
                            <Chip
                                key={niveau}
                                underline="hover"
                                label={niveau}
                                color={filterNiveau === niveau ? "primary" : "default"}
                                onClick={(e) => handleClick(e, niveau)}
                            />

                        ))}
                    </Stack>
                </div>
                <TextField id="outlined-search" label="Rechercher" type="search" size="small" value={searchText} onChange={handleSearchChange} />
            </Box>
            <Typography align="center" variant="h5" > Listes des matières </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell><TableCell align="center">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ marginLeft: "1px" }}>UE</span>
                                    <div style={{ display: "flex" }}>
                                        <IconButton
                                            color="inherit"
                                            size="small"
                                            onClick={handleSort}
                                            aria-label="Sort Ascending/Descending"
                                        >
                                            {sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                        </IconButton>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell align="center">Nom de la matière</TableCell>
                            <TableCell align="center">Niveau</TableCell>
                            <TableCell>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ marginLeft: "1px" }}>Parcours</span>
                                    <div style={{ display: "flex" }}>
                                        <IconButton
                                            color="inherit"
                                            size="small"
                                            onClick={handleSortParcours}
                                            aria-label="Sort Ascending/Descending"
                                        >
                                            {sortOrderParcours === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                        </IconButton>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell align="center">Semestre</TableCell>
                            <TableCell align="center">coefficient</TableCell>
                            <TableCell align="center">Poids</TableCell>
                            <TableCell align="center">Crédits EC </TableCell>
                            <TableCell align="center">
                                Action{" "}
                                <IconButton color="secondary" onClick={generatePdf} aria-label="print-to-pdf">
                                    <DownloadIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : matieres.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Aucune donnée pour l'instant.
                                </TableCell>
                            </TableRow>
                        ) : (
                            matieres.map((matiere) => (
                                <TableRow
                                    key={matiere.id}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {matiere.id}

                                    </TableCell>
                                    <TableCell align="center">{matiere.ue}</TableCell>
                                    <TableCell align="center">{matiere.nomMatiere}</TableCell>
                                    <TableCell align="center">{matiere.niveau}</TableCell>
                                    <TableCell align="center">{matiere.parcours}</TableCell>
                                    <TableCell align="center">{matiere.semestre}</TableCell>
                                    <TableCell align="center">{matiere.coefficient}</TableCell>
                                    <TableCell align="center">{matiere.poids}</TableCell>
                                    <TableCell align="center">{matiere.creditsEC}</TableCell>
                                    <TableCell align="center">
                                        <EditComponentMatiere
                                            id={matiere.id}
                                            ue={matiere.ue}
                                            nom={matiere.nomMatiere}
                                            niveau={matiere.niveau}
                                            parcours={matiere.parcours}
                                            semestre={matiere.semestre}
                                            coefficient={matiere.coefficient}
                                            poids={matiere.poids}
                                            credits={matiere.creditsEC}
                                            idEnseignant={matiere.id_enseignant}
                                            matieres={matieres}
                                            setMatieres={setMatieres}
                                        />
                                        <IconButton
                                            aria-label="delete"
                                            size="small"
                                            color="error"
                                            onClick={() => Supprimer(matiere.id)}
                                        >
                                            {deletingIds.includes(matiere.id) ? (
                                                <CircularProgress color="secondary" size={20} />
                                            ) : (
                                                <DeleteIcon fontSize="small" />
                                            )}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <Stack spacing={2}>
                    <Pagination
                        color="primary"
                        count={totalPages}
                        page={currentPage}
                        onChange={handleChangePage}
                    />
                </Stack>
            </div>
        </Box>
    );
};
