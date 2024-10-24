document.addEventListener('DOMContentLoaded', () => {

const username = 'quentin_dusserre_quentin'; // Remplace par ton nom d'utilisateur
const password = 'nIg974UeEM'; // Remplace par ton mot de passe
const apiUrl = 'https://api.meteomatics.com/2024-10-24T00:00:00Z--2024-10-27T00:00:00Z:PT1H/t_2m:C/47.2917,-2.5201/json';

// Fonction pour obtenir des données de l'API
async function getApiData() {
    const encodedCredentials = btoa(`${username}:${password}`);

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        // Traite les données ici
        console.log(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

// Appel de la fonction
getApiData();

});