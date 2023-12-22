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
  MenuItem,
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

export default function AddComponentEdutiant({ etudiants, setEtudiants }) {
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

const onAddSubmit = async (values) => {
  try {
    const response = await axiosInstance.post("/users", values);
    setLoading(false);
    handleClose();
    const newetudiant = response.data;
    setEtudiants((prevetudiants) => [...prevetudiants, newetudiant]); 
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
        Ajouter Etudiant
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
                label="Nom"
                variant="outlined"
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
                defaultValue=""
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
                type="number"
                label="Role"
                variant="outlined"
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
          ) : (<Button variant='outlined' endIcon={<SaveIcon />} type="submit">
            Enregistrer
          </Button>)}

        </DialogActions>
      </form>
    </BootstrapDialog>
  </>
);
}