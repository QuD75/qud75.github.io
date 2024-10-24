document.addEventListener('DOMContentLoaded', () => {

    // Variables pour le token et son expiration
let authToken = null;
let tokenExpiration = null;

// Fonction pour authentifier l'utilisateur et obtenir le token
async function authenticate() {
    const response = await fetch('https://login.meteomatics.com/api/v1/token', {
        method: 'GET',
        headers: {
            'Authorization': `Basic cXVlbnRpbl9kdXNzZXJyZV9xdWVudGluOm5JZzk3NFVlRU0=`, // Ajout de l'authentification Basic
            'Content-Type': 'application/json',
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

    const response = await fetch('https://api.example.com/data', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
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
        await authenticate('yourUsername', 'yourPassword'); // Authentification initiale
        const data = await fetchData(); // Récupération des données
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();

});