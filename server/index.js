// Importation des modules nécessaires
const express = require("express"); // Express est un framework web pour Node.js
const cors = require("cors"); // Cors est un middleware qui gère les autorisations de cross-origin resource sharing (CORS)
const mongoose = require("mongoose"); // Mongoose est une bibliothèque de gestion de base de données MongoDB
const userRoute = require("./Routes/userRoute"); // Importation du module de gestion des routes pour les utilisateurs
const chatRoute = require("./Routes/chatRoute"); // Importation du module de gestion des routes pour chat
const messageRoute = require("./Routes/messageRoute");

// Création de l'application Express
const app = express();

// Configuration de l'application en utilisant les variables d'environnement définies dans un fichier .env
require("dotenv").config();

// Configuration des middlewares
app.use(express.json()); // Middleware pour gérer les données JSON
app.use(cors()); // Middleware pour gérer les autorisations CORS (Cross-Origin Resource Sharing)
app.use("/api/users", userRoute); // Utilisation du module de gestion des routes pour les utilisateurs à l'URL /api/users
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Définition d'une route simple pour la page d'accueil
app.get("/", (req, res) => {
    res.send("Bienvenue sur mon application de chat");
});

// Configuration du port sur lequel le serveur écoutera les connexions entrantes
const port = process.env.PORT || 5000;

// Récupération de l'URI de la base de données MongoDB à partir des variables d'environnement
const uri = process.env.ATLAS_URI;

// Lancement du serveur Express pour écouter les connexions entrantes
app.listen(port, () => {
    console.log(`Le serveur fonctionne sur le port : ${port}`);
});

// Connexion à la base de données MongoDB en utilisant Mongoose
mongoose
    .connect(uri, {
        useNewUrlParser: true, // Utilisation du nouveau parseur URL pour MongoDB
        useUnifiedTopology: true // Utilisation d'une topologie de serveur unifiée pour MongoDB
    })
    .then(() => {
        console.log("Connexion à MongoDB établie");
    })
    .catch((error) => {
        console.log("Échec de la connexion à MongoDB: ", error.message);
    });
