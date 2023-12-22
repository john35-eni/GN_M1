// app.js

const express = require('express');
const cors = require('cors');
const app = express();
const usersRouter = require('./routes/users');
const matieresRouter = require('./routes/matiere');
const notesRouter = require('./routes/note');
//const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Récupérer le port à partir des variables d'environnement ou utiliser 3000 par défaut
const port = process.env.PORT || 8000;
const secretKey = process.env.SECRET_KEY;

dotenv.config();

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the actual origin of your React app
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Middleware d'authentification
/* function authenticate(req, res, next) {

  if (req.path === '/register' && req.method === 'POST') {
    return next(); // Autoriser la création d'utilisateur sans authentification
  }
  if (req.path === '/login' && req.method === 'POST') {
    return next(); // Autoriser la création d'utilisateur sans authentification
  }


  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Authentification invalide' });
    }
    req.user = user;
    next();
  });
} */
//app.use('/auth', authRoutes);
app.use(bodyParser.json());
// Middleware pour parser les données JSON
app.use(express.json());

//app.use(authenticate);
// Utilisation des routes définies dans users.js
app.use('/', usersRouter);
app.use('/', matieresRouter);
app.use('/', notesRouter);


// ... Autres configurations de votre application

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
