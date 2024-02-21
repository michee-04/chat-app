// Importation du module express pour la création de routes
const express = require("express");

// Importation des fonctions du contrôleur userController
const { registerUser, loginUser, findUser, getUsers } = require("../controllers/userController");

// Création d'un routeur Express pour gérer les routes liées aux utilisateurs
const router = express.Router();

// Définition des routes avec les fonctions correspondantes du contrôleur
router.post("/register", registerUser); // Route pour l'inscription d'un nouvel utilisateur
router.post("/login", loginUser); // Route pour la connexion d'un utilisateur
router.get("/find/:userId", findUser); // Route pour trouver un utilisateur par son identifiant
router.get("/", getUsers); // Route pour obtenir la liste de tous les utilisateurs

// Exportation du routeur pour qu'il puisse être utilisé dans d'autres parties de l'application
module.exports = router;
