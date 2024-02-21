import React, { createContext, useState, useCallback, useEffect } from 'react';
import { baseUrl, postRequest } from './../outils/service';

// Création d'un contexte React pour gérer l'authentification
export const AuthContext = createContext();

// Composant fournisseur du contexte d'authentification
export const AuthContextProvider = ({ children }) => {
    // État de l'utilisateur connecté
    const [user, setUser] = useState(null);

    // État et gestionnaire d'erreur d'inscription
    const [registerError, setRegisterError] = useState(null);

    // État et indicateur de chargement de l'inscription
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);

    // Informations d'inscription (nom, email, mot de passe)
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    });

    // État et gestionnaire d'erreur de connexion
    const [loginError, setLoginError] = useState(null);

    // État et indicateur de chargement de la connexion
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    // Informations de connexion (email, mot de passe)
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });

    // Utilisation de useEffect pour charger l'utilisateur depuis le stockage local lors du montage initial
    useEffect(() => {
        const storedUser = localStorage.getItem("User");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Gestionnaire de mise à jour des informations d'inscription
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);

    // Gestionnaire de mise à jour des informations de connexion
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, []);

    // Gestionnaire d'inscription utilisateur
    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await postRequest(
            `${baseUrl}/users/register`,
            JSON.stringify(registerInfo)
        );

        setIsRegisterLoading(false);

        if (response.error) {
            return setRegisterError(response);
        }

        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [registerInfo]);

    // Gestionnaire de connexion utilisateur
    const loginUser = useCallback(async (e) => {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);

        const response = await postRequest(
            `${baseUrl}/users/login`,
            JSON.stringify(loginInfo)
        );

        setIsLoginLoading(false);

        if (response.error) {
            return setLoginError(response);
        }

        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [loginInfo]);

    // Gestionnaire de déconnexion utilisateur
    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, []);

    // Fournit les valeurs du contexte aux composants enfants
    return (
        <AuthContext.Provider
            value={{
                user,
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                isRegisterLoading,
                logoutUser,
                loginUser,
                loginError,
                loginInfo,
                updateLoginInfo,
                isLoginLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


