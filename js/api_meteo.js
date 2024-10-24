document.addEventListener('DOMContentLoaded', () => {

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