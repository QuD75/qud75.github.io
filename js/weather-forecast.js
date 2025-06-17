document.addEventListener('DOMContentLoaded', () => {

    const apikeyOpenMeteoMap = '3019a6c49cea102650053a8919b5fa54';
    const apiKeyMeteoConcept = 'e0e611ffab773b1d4a1d6355862317ec39ea907e1f590a10a01ae07cc49ea9d8';
    const baseUrlOpenMeteoMap = 'https://api.openweathermap.org/data/3.0/onecall';
    const baseUrLMeteoConcept = 'https://api.meteo-concept.com/api/forecast/nextHours';
    const lat = 47.29;
    const lon = -2.52;
    const insee = '44049';
    const exclude = 'current,minutely,alerts';
    const units = 'metric';

    const openMeteoMapApi = `${baseUrlOpenMeteoMap}?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=${apikeyOpenMeteoMap}`;
    const meteoConceptApi = `${baseUrLMeteoConcept}?token=${apiKeyMeteoConcept}&insee=${insee}&hourly=true`;
  
    async function getApiData() {
        fetchData(openMeteoMapApi, 'open_meteo_map', 0, getOpenMeteoMapData); 
        fetchData(meteoConceptApi, 'meteo_concept', 0, getMeteoConceptData);
    }
  
    getApiData();
    
});  

function getOpenMeteoMapData(data){
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
      pressure: h.pressure,
      uvi: Math.round(h.uvi),
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
        <td></td>
        <td></td>
        <td>${entry.pressure}</td>
        <td></td>
        <td></td>
        <td></td>
        <td>${entry.uvi}</td>
        <td></td>
      `;

      tbody.appendChild(row);
    });
  }
}

function getMeteoConceptData(data){
  const tbody = document.querySelector('tbody');

  // Regrouper les données par jour
  const grouped = {};

  data.forecast.forEach(h => {
    const date = new Date(h.datetime);
    const optionsJour = { day: '2-digit', month: '2-digit', year: 'numeric'};
    const optionsHeure = { hour: '2-digit', minute: '2-digit'};
    const jour = date.toLocaleDateString('fr-FR', optionsJour);
    const heure = date.toLocaleTimeString('fr-FR', optionsHeure);

    if (!grouped[jour]) grouped[jour] = [];
    grouped[jour].push({
      heure,
      tempC: Math.round(h.temp2m),
      humidity: h.rh2m,
      wind_speed: h.wind10m,
      wind_gust: h.gust10m,
      wind_direction: h.dirwind10m,
      rain: h.rr10,
      description: h.weather
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
        <td></td>
        <td>${entry.wind_speed}</td>
        <td>${entry.wind_gust}</td>
        <td>${entry.wind_direction}</td>
        <td></td>
        <td>${entry.description}</td>
      `;

      tbody.appendChild(row);
    });
  }
}