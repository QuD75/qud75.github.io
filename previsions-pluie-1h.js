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
        const tableBody = document.getElementById('precipitation-data-1h');
        tableBody.innerHTML = ''; // Clear any existing data
    
        minutelyData.forEach(data => {
            const row = document.createElement('tr');
            const time = formatTime(data.dt);
            const precipitation = data.precipitation.toFixed(1);
    
            // Crée les cellules pour l'heure et la précipitation
            const timeCell = document.createElement('td');
            timeCell.textContent = time;
    
            const precipitationCell = document.createElement('td');
            precipitationCell.textContent = `${precipitation} mm`;
    
            // Applique une couleur en fonction de la quantité de précipitation
            if (data.precipitation > 0 && data.precipitation < 0.5) {
                precipitationCell.style.backgroundColor = '#ADD8E6'; // Bleu clair
            } else if (data.precipitation >= 0.5 && data.precipitation < 1) {
                precipitationCell.style.backgroundColor = '#6495ED'; // Bleu normal
            } else if (data.precipitation >= 1) {
                precipitationCell.style.backgroundColor = '#00008B'; // Bleu foncé
                precipitationCell.style.color = 'white'; // Texte blanc pour lisibilité
            }
    
            // Ajoute les cellules à la ligne
            row.appendChild(timeCell);
            row.appendChild(precipitationCell);
    
            // Ajoute la ligne au tableau
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

    // Fonction pour générer le graphique
    function generateChart(labels, dataPoints) {
        const ctx = document.getElementById('precipitation-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, // Les heures sur l'axe des abscisses
                datasets: [{
                    label: 'Précipitations (mm)',
                    data: dataPoints, // Les précipitations sur l'axe des ordonnées
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    fill: true,
                    tension: 0.1 // Adoucir les courbes
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Heure'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Précipitations (mm)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Génération du graphique après avoir obtenu les labels et dataPoints
    generateChart(labels, dataPoints);
    
});