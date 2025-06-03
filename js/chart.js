

function fetchTemperatureDataAndCreateChart(temperatureData) {
    try {  
      // Transforme les données si nécessaire
      const temperatureData = data.map(entry => ({
        ts: entry.ts,
        tempAvg: entry.tempAvg
      }));
  
      const labels = temperatureData.map(entry => {
        const date = new Date(entry.ts);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });
  
      const tempValues = temperatureData.map(entry => entry.tempAvg);
  
      const chartData = {
        labels: labels,
        datasets: [{
          label: 'Température moyenne (°C)',
          data: tempValues,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          tension: 0.3
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
  }