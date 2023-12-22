import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Chip, Typography, Stack } from "@mui/material";
import { NoteParNiveau } from "../NoteComponent/NoteParNiveau";

export const EtudiantDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const etudiantProps = {
        etudiantId: searchParams.get("etudiantId"),
        nom: searchParams.get("nom"),
        prenoms: searchParams.get("prenoms"),
        niveau: searchParams.get("niveau"),
        matricule: searchParams.get("matricule"),
        email: searchParams.get("email"),
        parcours: searchParams.get("parcours"),
    };

    const [selectedLevel, setSelectedLevel] = useState(null);

    const handleClick = (event, Niveau) => {
        event.preventDefault();
        setSelectedLevel(Niveau);
    };

    const renderGradeTable = () => {
        switch (selectedLevel) {
            case "L1":
                return <NoteParNiveau niveau="L1" id={etudiantProps.etudiantId} matricule={etudiantProps.matricule} nom={etudiantProps.nom} prenoms={etudiantProps.prenoms} parcours={etudiantProps.parcours} />;
            case "L2":
                return <NoteParNiveau niveau="L2" id={etudiantProps.etudiantId} matricule={etudiantProps.matricule} nom={etudiantProps.nom} prenoms={etudiantProps.prenoms} parcours={etudiantProps.parcours} />;
            case "L3":
                return <NoteParNiveau niveau="L3" id={etudiantProps.etudiantId} matricule={etudiantProps.matricule} nom={etudiantProps.nom} prenoms={etudiantProps.prenoms} parcours={etudiantProps.parcours} />;
            case "M1":
                return <NoteParNiveau niveau="M1" id={etudiantProps.etudiantId} matricule={etudiantProps.matricule} nom={etudiantProps.nom} prenoms={etudiantProps.prenoms} parcours={etudiantProps.parcours} />;
            case "M2":
                return <NoteParNiveau niveau="M2" id={etudiantProps.etudiantId} matricule={etudiantProps.matricule} nom={etudiantProps.nom} prenoms={etudiantProps.prenoms} parcours={etudiantProps.parcours} />;
            default:
                return <Typography align="center"> Selectionnez le niveau </Typography>
        }
    };

    return (
        <Box component="main" sx={{ p: 3 }}>
            <br />
            <br />
            <br />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <div role="presentation">
                    <Stack direction="row" spacing={1}>
                        {["L1", "L2", "L3", "M1", "M2"].map((niveau) => (
                            <Chip
                                key={niveau}
                                underline="hover"
                                label={niveau}
                                //variant="outlined"
                                color={selectedLevel === niveau ? "primary" : "default"}
                                onClick={(e) => handleClick(e, niveau)}
                            />

                        ))}
                    </Stack>
                </div>
            </Box>
            {renderGradeTable()}
        </Box>
    );
};
