document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '3019a6c49cea102650053a8919b5fa54';
    const lat = 47.2917;
    const lon = -2.5201;

    // URL de l'API OpenWeatherMap
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?units=metric&exclude=daily,alerts&lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fonction pour formater l'heure
    const formatTime = timestamp => new Date(timestamp * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // Fonction pour générer le tableau et le graphique
    function displayPrecipitationData(minutelyData) {
        const tableBody = document.getElementById('precipitation-data-1h');
        const labels = []; // Stocker les heures
        const dataPoints = []; // Stocker les précipitations
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

            // Appliquer la couleur en fonction de la valeur de précipitation
            if (precipitation > 0 && precipitation < 0.5) {
                precipitationCell.style.backgroundColor = '#ADD8E6'; // Bleu clair
            } else if (precipitation >= 0.5 && precipitation < 1) {
                precipitationCell.style.backgroundColor = '#6495ED'; // Bleu normal
            } else if (precipitation >= 1) {
                precipitationCell.style.backgroundColor = '#00008B'; // Bleu foncé
                precipitationCell.style.color = 'white'; // Texte blanc pour lisibilité
            }

            // Ajout des cellules à la ligne
            row.appendChild(timeCell);
            row.appendChild(precipitationCell);
            tableBody.appendChild(row);
        });

        // Debugging: Afficher les labels et dataPoints
        console.log('Labels:', labels);
        console.log('Data Points:', dataPoints);

        // Appel à la fonction pour générer le graphique
        generateChart(labels, dataPoints);
    }

    // Fonction pour générer le graphique
    function generateChart(labels, dataPoints) {
        const ctx = document.getElementById('precipitation-chart').getContext('2d');
        
        // Vérification que les données ne sont pas vides
        if (labels.length === 0 || dataPoints.length === 0) {
            console.warn("Aucune donnée à afficher dans le graphique.");
            return; // Arrêter la fonction si les données sont vides
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels, // Les heures sur l'axe des abscisses
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

    // Récupération des données météo via l'API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.minutely && data.minutely.length > 0) {
                displayPrecipitationData(data.minutely);
            } else {
                console.error("Aucune donnée de précipitation disponible.");
            }
        })
        .catch(error => console.error("Erreur lors de la récupération des données :", error));
});
