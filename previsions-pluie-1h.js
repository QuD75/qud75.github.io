document.addEventListener('DOMContentLoaded', () => {
    // Coordonnées et API Key
    const apiKey = '3019a6c49cea102650053a8919b5fa54';
    const lat = 47.2917;
    const lon = -2.5201;

    // URL de l'API OpenWeatherMap
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?units=metric&exclude=daily,alerts&lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fonction pour formater l'heure
    function formatTime(timestamp) {
        return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    // Fonction pour afficher les données de précipitations
    function displayPrecipitationData(minutelyData) {
        const tableBody = document.getElementById('precipitation-data');
        tableBody.innerHTML = ''; // Clear any existing data

        minutelyData.forEach(data => {
            const row = document.createElement('tr');
            const time = formatTime(data.dt);
            const precipitation = data.precipitation.toFixed(2);

            row.innerHTML = `
                <td>${time}</td>
                <td>${precipitation} mm</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Appel à l'API pour récupérer les données météo
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.minutely && data.minutely.length > 0) {
                displayPrecipitationData(data.minutely);
            } else {
                console.error("Aucune donnée de précipitation disponible.");
            }
        })
        .catch(error => console.error("Erreur lors de la récupération des données :", error));
});
