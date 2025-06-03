function fetchDataWeatherStationAndCreateCharts(data) {
    try {
        const temperatureData = data.observations.map(entry => ({
            time: entry.obsTimeLocal,
            temp: entry.metric.tempAvg
        }));

        const labels = temperatureData.map(entry => {
            const date = new Date(entry.time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        const tempValues = temperatureData.map(entry => entry.temp);
    
        const chartData = {
            labels: labels,
            datasets: [{
            label: 'Température (°C)',
            data: tempValues,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 1,
            pointRadius: 0        // Masquer les points
            }]
        };
    
        const config = {
            type: 'line',
            data: chartData,
            options: {
            responsive: true,
            scales: {
                y: {
                title: {
                    display: true,
                    text: 'Température (°C)'
                }
                },
                x: {
                title: {
                    display: true,
                    text: 'Heure'
                }
                }
            }
            }
        };
    
        new Chart(document.getElementById('temperatureChart'), config);
    } catch (error) {
    console.error('Erreur lors de la récupération des données température :', error);
    }

    try {
        const humidityData = data.observations.map(entry => ({
            time: entry.obsTimeLocal,
            hum: entry.humidityAvg
        }));

        const labels = humidityData.map(entry => {
            const date = new Date(entry.time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        const humidityValues = humidityData.map(entry => entry.hum);
    
        const chartData = {
            labels: labels,
            datasets: [{
            label: 'Humidité (%)',
            data: humidityValues,
            borderColor: 'rgb(99, 159, 255)',
            backgroundColor: 'rgba(60, 87, 218, 0.2)',
            fill: true,
            tension: 1,
            pointRadius: 0        // Masquer les points
            }]
        };
    
        const config = {
            type: 'line',
            data: chartData,
            options: {
            responsive: true,
            scales: {
                y: {
                title: {
                    display: true,
                    text: 'Humidité (%)'
                }
                },
                x: {
                title: {
                    display: true,
                    text: 'Heure'
                }
                }
            }
            }
        };
    
        new Chart(document.getElementById('humidityChart'), config);
    } catch (error) {
    console.error('Erreur lors de la récupération des données humidité :', error);
    }
}