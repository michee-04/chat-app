import React from 'react'
import { useState, useEffect } from "react";
import { getRequest, baseUrl } from './../outils/service';

export const useFetchRecipientUser = (chat, user) => {

    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members?.find((id) => id !== user?._id);

    useEffect( () => {

        const getUser = async () => {
            if (!recipientId) return null;
          
            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
          
            if (!response) {
              return setError("Réponse nulle reçue lors de la requête utilisateur.");
            }
          
            if (response.error) {
              return setError(response.error);
            }
          
            setRecipientUser(response);
          };
          

        
        getUser();
    }, [recipientId]);
    
    return { recipientUser }
};
