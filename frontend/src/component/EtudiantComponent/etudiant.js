import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../service/axios";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Link,
    Pagination,
    Stack,
    Chip,
    IconButton,
    CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Link as RouterLink } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AddComponentEdutiant from "./addEtudiant";
import EditComponentEtudiant from "./editEtudiant";
import AddNoteComponentEdutiant from "./addNoteEtudiant";

export const Etudiant = () => {
    const [etudiants, setEtudiants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingIds, setDeletingIds] = useState([]);
    const [filterNiveau, setFilterNiveau] = useState(""); // Set the initial state to an empty string or a default value
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState("asc");
    const [totalItems, setTotalItems] = useState(0);
    const isMounted = useRef(false);
    useEffect(() => {
        if (isMounted.current) {
            fetchEtudiants(filterNiveau, searchText);
        } else {
            isMounted.current = true;
            // Fetch etudiants with an empty filter when the component mounts
            fetchEtudiants(null, searchText);
        }
    }, [filterNiveau, searchText, currentPage, rowsPerPage]);

    const fetchEtudiants = async (filter = "", search = "") => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/users");
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

            setEtudiants(paginatedData);
            setCurrentPage(newCurrentPage); // Update the current page
            setTotalPages(newTotalPages); // Set the total number of pages
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

    const deleteEtudiant = (id) => {
        setDeletingIds((prevIds) => [...prevIds, id]);

        axiosInstance
            .delete(`/users/${id}`)
            .then(() => {
                Swal.fire("Supprimé!", "", "success");
                setDeletingIds((prevIds) => prevIds.filter((prevId) => prevId !== id));
                setEtudiants((prevetudiants) => prevetudiants.filter((etudiant) => etudiant.id !== id));
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
                deleteEtudiant(id);
            }
        });
    }

    const generatePdf = () => {
        const unit = "mm";
        const size = "A4";
        const orientation = "portrait";

        const doc = new jsPDF(orientation, unit, size);

        doc.text("Liste des étudiants", 10, 10);

        const tableData = etudiants.map((etudiant) => [
            etudiant.id,
            etudiant.nom,
            etudiant.prenoms,
            etudiant.niveau,
            etudiant.matricule,
            etudiant.email,
            etudiant.parcours,
        ]);

        doc.autoTable({
            head: [["ID", "nom", "prenoms", "niveau", "matricule", "email", "parcours"]],
            body: tableData,
        });

        doc.save("etudiants.pdf");
    };
    const handleSearchChange = (event) => {
        const newSearchText = event.target.value;
        setSearchText(newSearchText);

        // Reset data when search text is cleared
        if (newSearchText === "") {
            fetchEtudiants(filterNiveau, ""); // Pass an empty string for search
        }
    };

    // sorting table by parcours

    const handleSort = () => {
        // Toggle between ascending and descending order
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);

        // Implement sorting logic based on the order (asc or desc)
        const sortedetudiants = [...etudiants];
        sortedetudiants.sort((a, b) => {
            const parcoursA = a.parcours.toLowerCase();
            const parcoursB = b.parcours.toLowerCase();
            return newSortOrder === "asc" ? parcoursA.localeCompare(parcoursB) : parcoursB.localeCompare(parcoursA);
        });

        setEtudiants(sortedetudiants);
    };
    //fr
    return (
        <Box component="main" sx={{ p: 3 }}>
            <br />
            <br />
            <br />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <AddComponentEdutiant etudiants={etudiants} setEtudiants={setEtudiants} />
                <div role="presentation">
                    <Stack direction="row" spacing={1}>
                        {["L1", "L2", "L3", "M1", "M2"].map((niveau) => (
                            <Chip
                                key={niveau}
                                underline="hover"
                                label={niveau}
                                //variant="outlined"
                                color={filterNiveau === niveau ? "primary" : "default"}
                                onClick={(e) => handleClick(e, niveau)}
                            />

                        ))}
                    </Stack>
                </div>
                <TextField id="outlined-search" label="Rechercher" type="search" size="small" value={searchText} onChange={handleSearchChange} />
            </Box>
            <Typography align="center" variant="h5" > Listes des étudiants </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="center">Nom</TableCell>
                            <TableCell align="center">Prénoms</TableCell>
                            <TableCell align="center">Niveau</TableCell>
                            <TableCell align="center">Matricule</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ marginLeft: "1px" }}>Parcours</span>
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
                        ) : etudiants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Aucune donnée pour l'instant.
                                </TableCell>
                            </TableRow>
                        ) : (
                            etudiants.map((etudiant) => (
                                <TableRow
                                    key={etudiant.id}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {/* Convert etudiant.id to a link */}
                                        <Link
                                            component={RouterLink}
                                            to={{
                                                pathname: `/etudiant-note/${etudiant.id}`,
                                                search: `?etudiantId=${etudiant.id}&nom=${etudiant.nom}&prenoms=${etudiant.prenoms}&niveau=${etudiant.niveau}&matricule=${etudiant.matricule}&email=${etudiant.email}&parcours=${etudiant.parcours}`,
                                            }}
                                            color="primary"
                                        >
                                            {etudiant.id}
                                        </Link>

                                    </TableCell>
                                    <TableCell align="center">{etudiant.nom}</TableCell>
                                    <TableCell align="center">{etudiant.prenoms}</TableCell>
                                    <TableCell align="center">{etudiant.niveau}</TableCell>
                                    <TableCell align="center">{etudiant.matricule}</TableCell>
                                    <TableCell align="center">{etudiant.email}</TableCell>
                                    <TableCell align="center">{etudiant.parcours}</TableCell>
                                    <TableCell align="center">
                                        <EditComponentEtudiant
                                            id={etudiant.id}
                                            nom={etudiant.nom}
                                            prenoms={etudiant.prenoms}
                                            niveau={etudiant.niveau}
                                            matricule={etudiant.matricule}
                                            email={etudiant.email}
                                            parcours={etudiant.parcours}
                                            role={etudiant.role}
                                            etudiants={etudiants}
                                            setEtudiants={setEtudiants}
                                        />
                                        <IconButton
                                            aria-label="delete"
                                            size="small"
                                            color="error"
                                            onClick={() => Supprimer(etudiant.id)}
                                        >
                                            {deletingIds.includes(etudiant.id) ? (
                                                <CircularProgress color="secondary" size={20} />
                                            ) : (
                                                <DeleteIcon fontSize="small" />
                                            )}
                                        </IconButton>
                                        <AddNoteComponentEdutiant
                                            id={etudiant.id}
                                            niveau={etudiant.niveau}
                                            parcours={etudiant.parcours}
                                        />
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
