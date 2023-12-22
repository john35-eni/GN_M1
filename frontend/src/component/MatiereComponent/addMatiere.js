import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    IconButton,
    TextField,
    Container,
    Box,
    Snackbar,
    MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import axiosInstance from "../../service/axios";
import { useForm } from "react-hook-form";
import Alert from '@mui/material/Alert';
import Swal from "sweetalert2";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function AddComponentMatiere({ matieres, setMatieres }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const niveau = [
        {
            value: 'L1',
            label: 'L1',
        },
        {
            value: 'L2',
            label: 'L2',
        },
        {
            value: 'L3',
            label: 'L3',
        },
        {
            value: 'M1',
            label: 'M1',
        },
        {
            value: 'M2',
            label: 'M2',
        },
    ];

    const parcours = [
        {
            value: 'IG',
            label: 'IG',
        },
        {
            value: 'PRO',
            label: 'PRO',
        },
        {
            value: 'SR',
            label: 'SR',
        },
        {
            value: 'GB',
            label: 'GB',
        },
    ];

    const onAddSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/matieres", values);
            setLoading(false);
            handleClose();
            const newmatiere = response.data; // nouvel élément ajouté
            setMatieres((prevmatieres) => [...prevmatieres, newmatiere]); // mise à jour de la liste
            setSnackbarOpen(true);
        } catch (error) {
            handleClose();
            Swal.fire("Erreur", error.toString(), "error");
            setLoading(false);
        }
    };

    return (
        <>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Ajout avec succès!
                </Alert>
            </Snackbar>
            <Button variant="contained" color="primary" endIcon={<AddIcon />} onClick={handleClickOpen}>
                Ajouter
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Add Matières
                </BootstrapDialogTitle>
                <form onSubmit={handleSubmit(onAddSubmit)}>
                    <DialogContent dividers>
                        <Container>
                            <Box
                                sx={{
                                    width: 500,
                                    height: 250,
                                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                                }}
                            >

                                <TextField
                                    type="text"
                                    label="Nom de la matière"
                                    variant="outlined"
                                    id="nomMatiere"
                                    name="nomMatiere"
                                    fullWidth
                                    {...register("nomMatiere", {
                                        required: " Nom de la matière obligatoire",
                                        minLength: {
                                            value: 2,
                                            message: "Nom de la matière au moin 2 caractères",
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "Nom de la matière au maximum 50 caractères",
                                        },
                                    })}
                                    error={Boolean(errors.nomMatiere)}
                                    helperText={errors.nomMatiere?.message}
                                />
                                <TextField
                                    type="text"
                                    label="ue"
                                    variant="outlined"
                                    id="ue"
                                    name="ue"
                                    fullWidth
                                    {...register("ue", {
                                        required: "ue obligatoire",
                                        minLength: {
                                            value: 3,
                                            message: "ue au moins 3 caractères",
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: "ue au maximum 10 caractères",
                                        },
                                        pattern: {
                                            value: /^UE\d+$/,
                                            message: "Le champ doit commencer par 'UE' suivi de chiffres",
                                        },
                                    })}
                                    error={Boolean(errors.ue)}
                                    helperText={errors.ue?.message}
                                />
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="niveau"
                                    defaultValue=""
                                    fullWidth
                                    {...register("niveau", {
                                        required: "Niveau est obligatoire",
                                    })}
                                    error={Boolean(errors.niveau)}
                                    helperText={errors.niveau?.message}
                                >
                                    {niveau.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="parcours"
                                    defaultValue=""
                                    fullWidth
                                    {...register("parcours", {
                                        required: "parcours est obligatoire",
                                    })}
                                    error={Boolean(errors.parcours)}
                                    helperText={errors.parcours?.message}
                                >
                                    {parcours.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    type="number"
                                    label="Semestre"
                                    variant="outlined"
                                    id="semestre"
                                    name="semestre"
                                    fullWidth
                                    {...register("semestre", {
                                        required: "Semestre obligatoire",
                                        pattern: {
                                            value: /^[1-9]\d*$/, // Entiers positifs (pas de zéro)
                                            message: "Entrez un entier positif pour le semestre",
                                        },
                                    })}
                                    error={Boolean(errors.semestre)}
                                    helperText={errors.semestre?.message}
                                />
                                <TextField
                                    type="number"
                                    label="Coefficient"
                                    variant="outlined"
                                    id="coefficient"
                                    name="coefficient"
                                    fullWidth
                                    {...register("coefficient", {
                                        required: "Coefficient obligatoire",
                                        pattern: {
                                            value: /^[1-9]\d*$/, // Entiers positifs (pas de zéro)
                                            message: "Entrez un entier positif pour le Coefficient",
                                        },
                                    })}
                                    error={Boolean(errors.coefficient)}
                                    helperText={errors.coefficient?.message}
                                />
                                <TextField
                                    type="number"
                                    label="Identifiant de l'enseignant"
                                    variant="outlined"
                                    id="id_enseignant"
                                    name="id_enseignant"
                                    fullWidth
                                    {...register("id_enseignant", {
                                        required: "id_enseignant obligatoire",
                                        pattern: {
                                            value: /^[1-9]\d*$/, // Entiers positifs (pas de zéro)
                                            message: "Entrez un entier positif pour le Coefficient",
                                        },
                                    })}
                                    error={Boolean(errors.id_enseignant)}
                                    helperText={errors.id_enseignant?.message}
                                />
                                <TextField
                                    type="text"
                                    label="Poids"
                                    variant="outlined"
                                    id="poids"
                                    name="poids"
                                    fullWidth
                                    {...register("poids", {
                                        required: "Poids obligatoire",
                                        pattern: {
                                            value: /^(?:[1-9]\d*|0)?(?:\.\d+)?$/, // Entiers positifs, zéro, ou décimaux positifs
                                            message: "Entrez un nombre décimal ou un entier positif pour le Poids",
                                        },
                                    })}
                                    error={Boolean(errors.poids)}
                                    helperText={errors.poids?.message}
                                />
                                <TextField
                                    type="text"
                                    label="Credits"
                                    variant="outlined"
                                    id="creditsEC"
                                    name="creditsEC"
                                    fullWidth
                                    {...register("creditsEC", {
                                        required: "Poids obligatoire",
                                        pattern: {
                                            value: /^(?:[1-9]\d*|0)?(?:\.\d+)?$/, // Entiers positifs, zéro, ou décimaux positifs
                                            message: "Entrez un nombre décimal ou un entier positif pour le Credits",
                                        },
                                    })}
                                    error={Boolean(errors.creditsEC)}
                                    helperText={errors.creditsEC?.message}
                                />
                            </Box>
                        </Container>
                    </DialogContent>
                    <DialogActions>
                        {loading ? (
                            <Button>
                                Loading...
                            </Button>
                        ) : (<Button variant='outlined' endIcon={<SaveIcon />} type="submit">
                            Enregistrer
                        </Button>)}

                    </DialogActions>
                </form>
            </BootstrapDialog>
        </>
    );
}