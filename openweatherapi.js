document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '3019a6c49cea102650053a8919b5fa54';
    const lat = 47.2917;
    const lon = -2.5201;

    // URL de l'API OpenWeatherMap
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fonction pour formater l'heure
    const formatTime = timestamp => new Date(timestamp * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // Fonction pour générer le graphique
    const displayPrecipitationData = (minutely) => {
        const labels = [];
        const dataPoints = [];

        minutely.forEach(data => {
            const time = formatTime(data.dt);
            const precipitation = parseFloat(data.precipitation.toFixed(1));

            // Ajout des données pour le graphique
            labels.push(time);
            dataPoints.push(precipitation);
        });

        // Appel à la fonction pour générer le graphique
        generateChart(labels, dataPoints);
    };

    // Fonction pour afficher le graphique
    const generateChart = (labels, dataPoints) => {
        const ctx = document.getElementById('precipitation-chart').getContext('2d');
        
        if (!labels.length || !dataPoints.length) {
            console.warn("Aucune donnée à afficher dans le graphique.");
            return;
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    data: dataPoints,
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false // Ne pas afficher la légende
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Heure' }
                    },
                    y: {
                        title: { display: true, text: 'Précipitations (mm)' },
                        beginAtZero: true
                    }
                }
            }
        });
    };

    // Fonction pour extraire les données de température et de précipitation
    function extractTemperatureAndPrecipitation(hourly) {
        return hourly.map(data => {
            const temperature = data.temp; // Température
            const precipitation = data.rain ? (data.rain["1h"] || 0) : 0; // Précipitation, ou 0 s'il n'y en a pas
            
            return {
                time: formatTime(data.dt), // Format de l'heure
                temperature,
                precipitation
            };
        });
    }

    // Fonction pour afficher les données dans le tableau HTML
    function displayWeatherData(data) {
        const tableBody = document.getElementById('weather-data-body');
        tableBody.innerHTML = ''; // Efface le contenu précédent

        data.forEach(item => {
            const row = document.createElement('tr');
            
            const timeCell = document.createElement('td');
            timeCell.textContent = item.time;
            
            const tempCell = document.createElement('td');
            tempCell.textContent = item.temperature.toFixed(1); // Affiche la température avec 1 décimale
            
            const rainCell = document.createElement('td');
            rainCell.textContent = item.precipitation.toFixed(1); // Affiche les précipitations avec 1 décimale

            row.appendChild(timeCell);
            row.appendChild(tempCell);
            row.appendChild(rainCell);
            tableBody.appendChild(row);
        });
    }

    

    // Récupération des données météo via l'API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.minutely?.length) {
                displayPrecipitationData(data.minutely);
            }
            else {
                console.error("Aucune donnée de précipitation disponible.");
            }
            if (data.hourly?.length){
                displayWeatherData(extractTemperatureAndPrecipitation(data.hourly));
            }
            else {
                console.error("Aucune donnée de prévision disponible.");
            }
        })
        .catch(error => console.error("Erreur lors de la récupération des données :", error));
});
