document.addEventListener('DOMContentLoaded', () => {

// Variables pour le token et son expiration
let authToken = null;
let tokenExpiration = null;

// Fonction pour authentifier l'utilisateur et obtenir le token
async function authenticate() {
    const response = await fetch('https://login.meteomatics.com/api/v1/token', {
        method: 'GET',
        headers: {
            'Authorization': `Basic cXVlbnRpbl9kdXNzZXJyZV9xdWVudGluOm5JZzk3NFVlRU0=`,
            'Access-Control-Allow-Origin': "*"
        },
    });

    if (!response.ok) {
        throw new Error('Authentication failed');
    }

    const data = await response.json();
    authToken = data.token;
    tokenExpiration = Date.now() + 2 * 60 * 60 * 1000 - 60 * 1000; // Marge
}

// Fonction pour récupérer des données avec le token
async function fetchData() {
    // Vérifier si le token est valide
    if (!authToken || Date.now() >= tokenExpiration) {
        // Si le token est expiré ou inexistant, ré-authentifier
        await authenticate();
    }

    const response = await fetch('https://api.meteomatics.com/2024-10-24T00:00:00Z--2024-10-27T00:00:00Z:PT1H/t_2m:C/47.2917,-2.5201/json', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Access-Control-Allow-Origin': "*"
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data;
}

// Exemple d'utilisation
(async () => {
    try {
        await authenticate(); // Authentification initiale
        const data = await fetchData(); // Récupération des données
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();

});