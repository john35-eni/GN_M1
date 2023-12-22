import { useState } from 'react';
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

export default function EditComponentNoteRattrapage(props) {
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
        // eslint-disable-next-line no-unused-vars
        handleSubmit,
        // eslint-disable-next-line no-unused-vars
        formState: { errors, isSubmitting },
    } = useForm();

    const onEditSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`notesrattrapage/${props.id}/`, values);
            setLoading(false);
            handleClose();
            setSnackbarOpen(true);
            props.fetch();

        } catch (error) {
            handleClose();
            Swal.fire("Erreur", error.toString(), "error");
            setLoading(false);
        }
    };

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
                maxWidth={false}  // Ajustez la largeur en fonction du contenu
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Modifier note rattrapage
                </BootstrapDialogTitle>
                <form onSubmit={handleSubmit(onEditSubmit)}>
                    <DialogContent dividers>
                        <Container>
                            <Box>
                                <TextField
                                    type="text"
                                    label="Note"
                                    variant="outlined"
                                    id="note"
                                    name="note"
                                    defaultValue={props.note}
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