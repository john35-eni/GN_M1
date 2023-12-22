import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import {
    Button,
    IconButton,
    TextField,
    Container,
    Box,
    Snackbar
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
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

const sessionExamen = [
    {
        value: false,
        label: 'Normal',
    },
    {
        value: true,
        label: 'Rattrapage',
    },
];

export default function AddNoteComponentEdutiant(props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [matieres, setMatieres] = useState([]);

    useEffect(() => {
        const fetchMatieres = async () => {
            try {
                const response = await axiosInstance.get(`/matieres/${props.niveau}/${props.parcours}`);
                setMatieres(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des listes des matières', error);
            }
        };

        fetchMatieres();
    }, []);

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

    const onAddNoteSubmit = async (values) => {
        const dataNote = { ...values, idEtudiant: props.id, niveau: props.niveau };
        try {
            const response = await axiosInstance.post("/notes", dataNote);
            setLoading(false);
            handleClose();
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
                    Ajout de note avec succès!
                </Alert>
            </Snackbar>
            <IconButton aria-label="delete" size="small" onClick={handleClickOpen} color="primary">
                <AddIcon fontSize="small" />
            </IconButton>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Ajouter une note pour cette étudiant(e)
                </BootstrapDialogTitle>
                <form onSubmit={handleSubmit(onAddNoteSubmit)}>
                    <DialogContent dividers>
                        <Container>
                            <Box
                                sx={{
                                    width: '100%', 
                                    maxHeight: '80vh', 
                                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                                }}
                            >
                                <TextField
                                    id="outlined-select-currency-native"
                                    select
                                    label="Matière"
                                    defaultValue=""
                                    SelectProps={{
                                        native: true,
                                    }}
                                    {...register("idMatiere", {
                                        required: "matiere obligatoire",
                                    })}
                                    error={Boolean(errors.matiere)}
                                    helperText={errors.matiere?.message}
                                >
                                    {matieres.map((matiere) => (
                                        <option key={matiere.id} value={matiere.id}>
                                            {matiere.nomMatiere}
                                        </option>
                                    ))}
                                </TextField>

                                <TextField
                                    type="text"
                                    label="Note"
                                    variant="outlined"
                                    id="note"
                                    name="note"
                                    fullWidth
                                    {...register("valeurNote", {
                                        required: "La note est obligatoire",
                                        pattern: {
                                            value: /^(?:\d+|\d*\.\d+)$/, // Nombre décimal positif ou zéro
                                            message: "Entrez un nombre décimal positif ou zéro pour la note",
                                        },
                                        max: {
                                            value: 20,
                                            message: "La note ne peut pas dépasser 20",
                                        },
                                    })}
                                    error={Boolean(errors.valeurNote)}
                                    helperText={errors.valeurNote?.message}
                                />

                                <TextField
                                    id="outlined-select-currency-native"
                                    select
                                    label="Session"
                                    defaultValue=""
                                    SelectProps={{
                                        native: true,
                                    }}
                                    {...register("rattrapage", {
                                        required: "session obligatoire",
                                    })}
                                    error={Boolean(errors.rattrapage)}
                                    helperText={errors.rattrapage?.message}
                                >
                                    {sessionExamen.map((session, index) => (
                                        <option key={index} value={session.value}>
                                            {session.label}
                                        </option>
                                    ))}
                                </TextField>


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