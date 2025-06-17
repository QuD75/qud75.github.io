document.addEventListener('DOMContentLoaded', () => {

    const apikey = '3019a6c49cea102650053a8919b5fa54';
    const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall';
    const lat = 47.29;
    const lon = -2.52;
    const exclude = 'current,minutely,alerts';
    const units = 'metric';

    const weatherForecastApi = `${baseUrl}?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=${apikey}`;
  
    async function getApiData() {
        fetchData(weatherForecastApi, 'weather_forecast', 0, getWeatherForecastData);
    }
  
    getApiData();
    
});

function getWeatherForecastData(data){
    const tbody = document.querySelector('tbody');

    // Regrouper les données par jour
  const grouped = {};

  data.hourly.forEach(h => {
    const date = new Date(h.dt * 1000);
    const optionsJour = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: data.timezone };
    const optionsHeure = { hour: '2-digit', minute: '2-digit', timeZone: data.timezone };
    const jour = date.toLocaleDateString('fr-FR', optionsJour);
    const heure = date.toLocaleTimeString('fr-FR', optionsHeure);

    if (!grouped[jour]) grouped[jour] = [];
    grouped[jour].push({
      heure,
      tempC: h.temp.toFixed(1),
      humidity: h.humidity,
      pressure: h.pressure,
      wind_speed: h.wind_speed.toFixed(1),
      uvi: h.uvi.toFixed(1),
      description: h.weather[0].description
    });
  });

  // Générer les lignes du tableau avec rowspan
  for (const [jour, heures] of Object.entries(grouped)) {
    heures.forEach((entry, index) => {
      const row = document.createElement("tr");

      if (index === 0) {
        const jourCell = document.createElement("td");
        jourCell.rowSpan = heures.length;
        jourCell.textContent = jour;
        row.appendChild(jourCell);
      }

      row.innerHTML += `
        <td>${entry.heure}</td>
        <td>${entry.tempC}</td>
        <td>${entry.humidity}</td>
        <td>${entry.pressure}</td>
        <td>${entry.wind_speed}</td>
        <td>${entry.uvi}</td>
        <td>${entry.description}</td>
      `;

      tbody.appendChild(row);
    });
  }

}