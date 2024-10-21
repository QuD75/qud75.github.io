document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '3019a6c49cea102650053a8919b5fa54';
    const lat = 47.2917;
    const lon = -2.5201;

    // URL de l'API OpenWeatherMap
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?units=metric&exclude=daily,alerts&lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fonction pour formater l'heure
    const formatTime = timestamp => new Date(timestamp * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // Fonction pour générer le tableau et le graphique
    const displayPrecipitationData = (minutelyData) => {
        const tableBody = document.getElementById('precipitation-data-1h');
        const labels = [];
        const dataPoints = [];
        tableBody.innerHTML = ''; // Effacer les données existantes

        minutelyData.forEach(data => {
            const time = formatTime(data.dt);
            const precipitation = parseFloat(data.precipitation.toFixed(1));

            // Ajout des données pour le graphique
            labels.push(time);
            dataPoints.push(precipitation);

            // Création de la ligne du tableau
            const row = document.createElement('tr');
            const timeCell = document.createElement('td');
            const precipitationCell = document.createElement('td');

            timeCell.textContent = time;
            precipitationCell.textContent = `${precipitation} mm`;
            precipitationCell.style.backgroundColor = getPrecipitationColor(precipitation); // Détermination de la couleur

            // Ajout des cellules à la ligne
            row.append(timeCell, precipitationCell); // Méthode append pour ajouter plusieurs éléments
            tableBody.appendChild(row);
        });

        // Appel à la fonction pour générer le graphique
        generateChart(labels, dataPoints);
    };

    // Fonction pour déterminer la couleur en fonction de la précipitation
    const getPrecipitationColor = (precipitation) => {
        if (precipitation > 0 && precipitation < 0.5) return '#ADD8E6'; // Bleu clair
        if (precipitation >= 0.5 && precipitation < 1) return '#6495ED'; // Bleu normal
        if (precipitation >= 1) return '#00008B'; // Bleu foncé
        return ''; // Pas de couleur pour les précipitations nulles
    };

    // Fonction pour générer le graphique
    const generateChart = (labels, dataPoints) => {
        const ctx = document.getElementById('precipitation-chart').getContext('2d');
        
        if (!labels.length || !dataPoints.length) {
            console.warn("Aucune donnée à afficher dans le graphique.");
            return;
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Précipitations (mm)',
                    data: dataPoints,
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
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

    // Récupération des données météo via l'API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.minutely?.length) {
                displayPrecipitationData(data.minutely);
            } else {
                console.error("Aucune donnée de précipitation disponible.");
            }
        })
        .catch(error => console.error("Erreur lors de la récupération des données :", error));
});
