document.addEventListener('DOMContentLoaded', () => {

// Fonction pour récupérer des données avec le token
async function getApiData() {

    const response = await fetch('https://quentin_dusserre_quentin:nIg974UeEM@api.meteomatics.com/2024-10-24T00:00:00Z--2024-10-27T00:00:00Z:PT1H/t_2m:C/47.2917,-2.5201/json', {
        method: 'GET'
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
        const data = await getApiData(); // Récupération des données
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();

});