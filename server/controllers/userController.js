// Importation du modèle utilisateur, du module de hachage (bcrypt), de la bibliothèque de validation (validator) et de JWT (jsonwebtoken)
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// Fonction pour créer un jeton JWT basé sur l'ID de l'utilisateur
const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

// Fonction pour gérer l'inscription d'un nouvel utilisateur
const registerUser = async (req, res) => {
    try {
        // Extraction des données de la requête
        const { name, email, password } = req.body;

        // Vérification si l'utilisateur avec cet email existe déjà
        let user = await userModel.findOne({ email });

        if (user) 
            return res.status(400).json("L'utilisateur avec cet email existe déjà...");

        // Vérification des champs obligatoires
        if (!name || !email || !password) 
            return res.status(400).json("Tous les champs sont obligatoires");

        // Validation de l'adresse email
        if (!validator.isEmail(email))
            return res.status(400).json("L'adresse email doit être une adresse email valide");

        // Validation du mot de passe
        if (!validator.isStrongPassword(password))
            return res.status(400).json("Le mot de passe doit être un mot de passe valide");

        // Création d'un nouvel utilisateur avec le modèle utilisateur
        user = new userModel({ name, email, password });

        // Hachage du mot de passe avant de l'enregistrer
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // Enregistrement de l'utilisateur dans la base de données
        await user.save();

        // Création d'un jeton JWT pour l'utilisateur
        const token = createToken(user._id);

        // Réponse avec les informations de l'utilisateur et le jeton JWT
        res.status(200).json({ _id: user._id, name, email, token });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

// Fonction pour gérer la connexion d'un utilisateur
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Recherche de l'utilisateur par son adresse email
        let user = await userModel.findOne({ email });

        // Vérification si l'utilisateur existe
        if (!user)
            return res.status(400).json("Mot de passe ou email invalide.....")

        // Vérification de la validité du mot de passe en le comparant au hachage stocké
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
            return res.status(400).json("Mot de passe invalide");

        // Création d'un jeton JWT pour l'utilisateur
        const token = createToken(user._id);

        // Réponse avec les informations de l'utilisateur et le jeton JWT
        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

// Fonction pour trouver un utilisateur par son identifiant
const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        // Recherche de l'utilisateur par son identifiant
        const user = await userModel.findById(userId);

        // Réponse avec les informations de l'utilisateur
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

// Fonction pour obtenir la liste de tous les utilisateurs
const getUsers = async (req, res) => {
    try {
        // Recherche de tous les utilisateurs dans la base de données
        const users = await userModel.find();

        // Réponse avec la liste des utilisateurs
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

// Exportation des fonctions du contrôleur pour les utiliser dans les routes
module.exports = { registerUser, loginUser, findUser, getUsers };
