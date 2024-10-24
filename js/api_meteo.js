document.addEventListener('DOMContentLoaded', () => {

const username = 'quentin_dusserre_quentin'; // Remplace par ton nom d'utilisateur
const password = 'nIg974UeEM'; // Remplace par ton mot de passe
const apiUrl = 'https://api.meteomatics.com/2024-10-24T00:00:00Z--2024-10-27T00:00:00Z:PT1H/t_2m:C/47.2917,-2.5201/json';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

async function getApiData() {
    fetch(proxyUrl + apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${btoa('${username}:${password}')}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
    })
    .then(response => {
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log(data);
        // Traite tes données ici
    })
    .catch(error => console.error("Erreur lors de la récupération des données :", error));
}


// Appel de la fonction
getApiData();

});