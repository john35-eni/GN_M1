import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useForm } from "react-hook-form";
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import axiosInstance from "../../service/axios";
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

export default function EditComponentEtudiant(props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { etudiants, setEtudiants } = props;
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

    const onEditSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/users/${props.id}/`, values);
            setLoading(false);
            handleClose();

            // Find the index of the item to be updated in the array
            const updatedIndex = etudiants.findIndex((etudiant) => etudiant.id === props.id);

            // Create a copy of the matieres array to avoid mutating state directly
            const updatedEtudiants = [...etudiants];

            // Replace the existing item with the updated item
            updatedEtudiants[updatedIndex] = response.data;

            // Update the state with the modified array
            setEtudiants(updatedEtudiants);
            setSnackbarOpen(true);

        } catch (error) {
            handleClose();
            Swal.fire("Erreur", error.toString(), "error");
            setLoading(false);
        }
    };

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

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    Modification avec succès!
                </Alert>
            </Snackbar>
            <IconButton aria-label="delete" size="small" onClick={handleClickOpen} color="secondary">
                <EditIcon fontSize="small" />
            </IconButton>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Update student
                </BootstrapDialogTitle>
                <form onSubmit={handleSubmit(onEditSubmit)}>
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
                                    label="Nom"
                                    variant="outlined"
                                    defaultValue={props.nom}
                                    id="nom"
                                    name="nom"
                                    fullWidth
                                    {...register("nom", {
                                        required: " Nom obligatoire",
                                        minLength: {
                                            value: 2,
                                            message: "Nom au moin 2 caractères",
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "Noms au maximum 50 caractères",
                                        },
                                    })}
                                    error={Boolean(errors.nom)}
                                    helperText={errors.nom?.message}
                                />
                                <TextField
                                    type="text"
                                    label="Prénoms"
                                    defaultValue={props.prenoms}
                                    variant="outlined"
                                    id="prenoms"
                                    name="prenoms"
                                    fullWidth
                                    {...register("prenoms", {
                                        required: "prenoms obligatoire",
                                        minLength: {
                                            value: 2,
                                            message: "prenoms au moin 2 caractères",
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "prenoms au maximum 50 caractères",
                                        },
                                    })}
                                    error={Boolean(errors.prenoms)}
                                    helperText={errors.prenoms?.message}
                                />
                                <TextField
                                    type="text"
                                    label="Matricule"
                                    variant="outlined"
                                    defaultValue={props.matricule}
                                    id="matricule"
                                    name="matricule"
                                    fullWidth
                                    {...register("matricule", {
                                        required: "Matricule obligatoire",
                                        pattern: {
                                            value: /^[0-9]+H-F$/,
                                            message: "Matricule invalide. Doit être composé de chiffres suivis de 'H-F'",
                                        },
                                    })}
                                    error={Boolean(errors.matricule)}
                                    helperText={errors.matricule?.message}
                                />

                                <TextField
                                    type="text"
                                    label="Email"
                                    variant="outlined"
                                    defaultValue={props.email}
                                    id="email"
                                    name="email"
                                    fullWidth
                                    {...register("email", {
                                        required: "Email obligatoire",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message: "adresse email non valide",
                                        },
                                    })}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email?.message}
                                />


                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Parcours"
                                    defaultValue={props.parcours}
                                    fullWidth
                                    {...register("parcours", {
                                        required: "Parcours est obligatoire",
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
                                    id="outlined-select-currency"
                                    select
                                    label="Niveau"
                                    defaultValue={props.niveau}
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
                                    type="number"
                                    label="Role"
                                    variant="outlined"
                                    defaultValue={props.role}
                                    id="role"
                                    name="role"
                                    fullWidth
                                    {...register("role", {
                                        required: "Semestre obligatoire",
                                        pattern: {
                                            value: /^[1-9]\d*$/, // Entiers positifs (pas de zéro)
                                            message: "Entrez un entier positif pour le semestre",
                                        },
                                    })}
                                    error={Boolean(errors.role)}
                                    helperText={errors.role?.message}
                                />
                            </Box>
                        </Container>
                    </DialogContent>
                    <DialogActions>
                        {loading ? (
                            <Button>
                                Loading...
                            </Button>
                        ) : (<Button variant='outlined' endIcon={<SendIcon />} type="submit">
                            Modifier
                        </Button>)}
                    </DialogActions>
                </form>
            </BootstrapDialog>
        </>
    );
}