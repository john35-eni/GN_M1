import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import {
    Snackbar,
    MenuItem,
    Box,
    Container,
    TextField,
    IconButton,
    Button
} from '@mui/material';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from "../../service/axios";
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

export default function EditComponentMatiere(props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { matieres, setMatieres } = props;
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
            const response = await axiosInstance.put(`/matieres/${props.id}/`, values);
            setLoading(false);
            handleClose();

            // Find the index of the item to be updated in the array
            const updatedIndex = matieres.findIndex((matiere) => matiere.id === props.id);

            // Create a copy of the matieres array to avoid mutating state directly
            const updatedMatieres = [...matieres];

            // Replace the existing item with the updated item
            updatedMatieres[updatedIndex] = response.data;

            // Update the state with the modified array
            setMatieres(updatedMatieres);
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
                                    label="Nom de la matière"
                                    variant="outlined"
                                    id="nomMatiere"
                                    name="nomMatiere"
                                    defaultValue={props.nom}
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
                                    defaultValue={props.ue}
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
                                    onChange={(e) => props.onChange('niveau', e.target.value)}
                                    value={props.niveau}
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
                                    defaultValue={props.parcours}
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
                                    defaultValue={props.semestre}
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
                                    defaultValue={props.coefficient}
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
                                    defaultValue={props.idEnseignant}
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
                                    defaultValue={props.poids}
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
                                    defaultValue={props.credits}
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
                        ) : (<Button variant='outlined' endIcon={<SendIcon />} type="submit">
                            Update
                        </Button>)}
                    </DialogActions>
                </form>
            </BootstrapDialog>
        </>
    );
}