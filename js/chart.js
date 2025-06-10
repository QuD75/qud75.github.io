/* document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById("plage");
    const dayBloc = document.getElementById("day-chart");
    const weekBloc = document.getElementById("week-chart");

    function toggleBlocs() {
        const selected = select.value;

        dayBloc.style.display = selected === "day" ? "block" : "none";
        weekBloc.style.display = selected === "week" ? "block" : "none";
    }

    // Exécuter au chargement pour afficher le bon bloc initialement
    toggleBlocs();

    // Mettre à jour lors d’un changement
    select.addEventListener("change", toggleBlocs);
}); */

function fetchDataWeatherStationAndCreateChartsDay(data) {
    try {
        const temperatureData = data.observations.map(entry => ({
            time: entry.obsTimeLocal,
            temp: entry.metric.tempAvg
        }));

        const labels = temperatureData.map(entry => {
            const date = new Date(entry.time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        const rawTemps = temperatureData.map(entry => entry.temp);
        const tempValues = smoothData(rawTemps, 5);
    
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
                plugins: {
                    title: {
                      display: true,
                      text: 'Température sur la journée', // ← Ton titre ici
                      font: {
                        size: 18
                      }
                    },
                    legend: {
                      display: false // ← Masquer la légende
                    }
                }, 
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
    
        new Chart(document.getElementById('temperatureChartDay'), config);
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

        const rawHums = humidityData.map(entry => entry.hum);
        const humidityValues = smoothData(rawHums, 5);
    
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
                plugins: {
                    title: {
                      display: true,
                      text: 'Humidité sur la journée', // ← Ton titre ici
                      font: {
                        size: 18
                      }
                    },
                    legend: {
                      display: false // ← Masquer la légende
                    }
                }, 
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
    
        new Chart(document.getElementById('humidityChartDay'), config);
    } catch (error) {
    console.error('Erreur lors de la récupération des données humidité :', error);
    }

    try {
        const pressureData = data.observations.map(entry => ({
            time: entry.obsTimeLocal,
            pressure: entry.metric.pressureMin+7
        }));

        const labels = pressureData.map(entry => {
            const date = new Date(entry.time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        const rawPressure = pressureData.map(entry => entry.pressure);
        const pressureValues = smoothData(rawPressure, 5);
    
        const chartData = {
            labels: labels,
            datasets: [{
            label: 'Pression (hPa)',
            data: pressureValues,
            borderColor: 'rgb(114, 246, 107)',
            backgroundColor: 'rgba(29, 192, 26, 0.2)',
            fill: true,
            tension: 1,
            pointRadius: 0        // Masquer les points
            }]
        };
    
        const config = {
            type: 'line',
            data: chartData,
            options: {
                plugins: {
                    title: {
                      display: true,
                      text: 'Pression sur la journée', // ← Ton titre ici
                      font: {
                        size: 18
                      }
                    },
                    legend: {
                      display: false // ← Masquer la légende
                    }
                }, 
                responsive: true,
                scales: {
                    y: {
                    title: {
                        display: true,
                        text: 'Pression (hPa)'
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
    
        new Chart(document.getElementById('pressureChartDay'), config);
    } catch (error) {
    console.error('Erreur lors de la récupération des données pression :', error);
    }

    try {
        const rainData = data.observations.map(entry => ({
            time: entry.obsTimeLocal,
            rain: entry.metric.precipTotal
        }));

        const labels = rainData.map(entry => {
            const date = new Date(entry.time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        const rawrain = rainData.map(entry => entry.rain);
        const rainValues = smoothData(rawrain, 5);
    
        const chartData = {
            labels: labels,
            datasets: [{
            label: 'Précipitations (mm)',
            data: rainValues,
            borderColor: 'rgb(0, 76, 255)',
            backgroundColor: 'rgba(0, 98, 255, 0.2)',
            fill: true,
            tension: 1,
            pointRadius: 0        // Masquer les points
            }]
        };
    
        const config = {
            type: 'line',
            data: chartData,
            options: {
                plugins: {
                    title: {
                      display: true,
                      text: 'Température sur la journée', // ← Ton titre ici
                      font: {
                        size: 18
                      }
                    },
                    legend: {
                      display: false // ← Masquer la légende
                    }
                }, 
                responsive: true,
                scales: {
                    y: {
                    min: 0,
                    title: {
                        display: true,
                        text: 'Précipitations (mm)'
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
    
        new Chart(document.getElementById('rainChartDay'), config);
    } catch (error) {
    console.error('Erreur lors de la récupération des données pluie :', error);
    }
}

function fetchDataWeatherStationAndCreateChartsWeek(data) {
    try {
        const temperatureData = data.observations.map(entry => ({
            time: entry.obsTimeLocal,
            temp: entry.metric.tempAvg
        }));

        const labels = temperatureData.map(entry => {
            const date = new Date(entry.time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        const rawTemps = temperatureData.map(entry => entry.temp);
        const tempValues = smoothData(rawTemps, 5);
    
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
                plugins: {
                    title: {
                      display: true,
                      text: 'Température sur la journée', // ← Ton titre ici
                      font: {
                        size: 18
                      }
                    },
                    legend: {
                      display: false // ← Masquer la légende
                    }
                }, 
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
    
        new Chart(document.getElementById('temperatureChartWeek'), config);
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

        const rawHums = humidityData.map(entry => entry.hum);
        const humidityValues = smoothData(rawHums, 5);
    
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
                plugins: {
                    title: {
                      display: true,
                      text: 'Humidité sur la journée', // ← Ton titre ici
                      font: {
                        size: 18
                      }
                    },
                    legend: {
                      display: false // ← Masquer la légende
                    }
                }, 
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
    
        new Chart(document.getElementById('humidityChartWeek'), config);
    } catch (error) {
    console.error('Erreur lors de la récupération des données humidité :', error);
    }

    try {
        const pressureData = data.observations.map(entry => ({
            time: entry.obsTimeLocal,
            pressure: entry.metric.pressureMin+7
        }));

        const labels = pressureData.map(entry => {
            const date = new Date(entry.time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        const rawPressure = pressureData.map(entry => entry.pressure);
        const pressureValues = smoothData(rawPressure, 5);
    
        const chartData = {
            labels: labels,
            datasets: [{
            label: 'Pression (hPa)',
            data: pressureValues,
            borderColor: 'rgb(114, 246, 107)',
            backgroundColor: 'rgba(29, 192, 26, 0.2)',
            fill: true,
            tension: 1,
            pointRadius: 0        // Masquer les points
            }]
        };
    
        const config = {
            type: 'line',
            data: chartData,
            options: {
                plugins: {
                    title: {
                      display: true,
                      text: 'Pression sur la journée', // ← Ton titre ici
                      font: {
                        size: 18
                      }
                    },
                    legend: {
                      display: false // ← Masquer la légende
                    }
                }, 
                responsive: true,
                scales: {
                    y: {
                    title: {
                        display: true,
                        text: 'Pression (hPa)'
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
    
        new Chart(document.getElementById('pressureChartWeek'), config);
    } catch (error) {
    console.error('Erreur lors de la récupération des données pression :', error);
    }

    try {
        const rainData = data.observations.map(entry => ({
            time: entry.obsTimeLocal,
            rain: entry.metric.precipTotal
        }));

        const labels = rainData.map(entry => {
            const date = new Date(entry.time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        const rawrain = rainData.map(entry => entry.rain);
        const rainValues = smoothData(rawrain, 5);
    
        const chartData = {
            labels: labels,
            datasets: [{
            label: 'Précipitations (mm)',
            data: rainValues,
            borderColor: 'rgb(0, 76, 255)',
            backgroundColor: 'rgba(0, 98, 255, 0.2)',
            fill: true,
            tension: 1,
            pointRadius: 0        // Masquer les points
            }]
        };
    
        const config = {
            type: 'line',
            data: chartData,
            options: {
                plugins: {
                    title: {
                      display: true,
                      text: 'Température sur la journée', // ← Ton titre ici
                      font: {
                        size: 18
                      }
                    },
                    legend: {
                      display: false // ← Masquer la légende
                    }
                }, 
                responsive: true,
                scales: {
                    y: {
                    min: 0,
                    title: {
                        display: true,
                        text: 'Précipitations (mm)'
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
    
        new Chart(document.getElementById('rainChartWeek'), config);
    } catch (error) {
    console.error('Erreur lors de la récupération des données pluie :', error);
    }
}

function smoothData(values, windowSize = 1) {
    const smoothed = [];
  
    for (let i = 0; i < values.length; i++) {
      let sum = 0;
      let count = 0;
  
      for (let j = -Math.floor(windowSize / 2); j <= Math.floor(windowSize / 2); j++) {
        const index = i + j;
        if (index >= 0 && index < values.length) {
          sum += values[index];
          count++;
        }
      }
  
      smoothed.push(sum / count);
    }
  
    //return smoothed;
    return values;
}