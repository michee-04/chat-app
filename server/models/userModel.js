// Importation du module mongoose pour la gestion de la base de données MongoDB
const mongoose = require("mongoose");

// Définition du schéma de données pour les utilisateurs
const userSchema = new mongoose.Schema({
    name: {
        type: String, // Le champ "name" doit être de type String
        required: true, // Il est requis, c'est-à-dire qu'il doit être présent dans chaque document
        minlength: 3, // La longueur minimale du champ est de 3 caractères
        maxlength: 30 // La longueur maximale du champ est de 30 caractères
    },
    email: {
        type: String, // Le champ "email" doit être de type String
        required: true, // Il est requis
        minlength: 3, // La longueur minimale du champ est de 3 caractères
        maxlength: 200, // La longueur maximale du champ est de 200 caractères
        unique: true // Chaque adresse email doit être unique dans la base de données
    },
    password: {
        type: String, // Le champ "password" doit être de type String
        required: true, // Il est requis
        minlength: 3, // La longueur minimale du champ est de 3 caractères
        maxlength: 1024 // La longueur maximale du champ est de 1024 caractères
    }
}, {
    timestamps: true // Ajoute automatiquement des champs de date de création et de mise à jour à chaque document
});

// Création d'un modèle mongoose basé sur le schéma défini
const userModel = mongoose.model("user", userSchema);

// Exportation du modèle pour qu'il puisse être utilisé ailleurs dans l'application
module.exports = userModel;
