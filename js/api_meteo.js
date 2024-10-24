document.addEventListener('DOMContentLoaded', () => {

const username = 'quentin_dusserre_quentin'; // Remplace par ton nom d'utilisateur
const password = 'nIg974UeEM'; // Remplace par ton mot de passe
const lat = '47.2917';
const lon = '-2.5201';
const params = 't_2m:C';
const beginDate = '2024-10-24T00:00:00Z';
const endDate = '2024-10-27T00:00:00Z';
const apiUrl = `https://api.meteomatics.com/${beginDate}--${endDate}:PT1H/${params}/${lat},${lon}/json`;s
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

async function getApiData() {
    const encodedCredentials = btoa(`${username}:${password}`);
    fetch(proxyUrl + apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': encodedCredentials,
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