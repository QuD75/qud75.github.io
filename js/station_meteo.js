document.addEventListener('DOMContentLoaded', () => {

  const stationId = 'ILECRO29';
  const stationApiKey = '556a0b6740e249fdaa0b6740e2c9fdea';
  const baseUrl = 'https://api.weather.com/v2/pws/observations';
  
  const api_station_meteo = `${baseUrl}/current?stationId=${stationId}&format=json&units=m&apiKey=${stationApiKey}&numericPrecision=decimal`;
  const api_station_meteo_day = `${baseUrl}/all/1day?stationId=${stationId}&format=json&units=m&apiKey=${stationApiKey}&numericPrecision=decimal`;
  const api_station_meteo_week = `${baseUrl}/hourly/7day?stationId=${stationId}&format=json&units=m&apiKey=${stationApiKey}&numericPrecision=decimal`;

  async function getApiData() {
      fetchData(api_station_meteo, 'station_meteo', 1, getWeatherStationData, false);
      fetchData(api_station_meteo_day, 'station_meteo_day', 1, fetchDataWeatherStationAndCreateChartsDay, false);
      fetchData(api_station_meteo_week, 'station_meteo_week', 1, fetchDataWeatherStationAndCreateChartsWeek, false);
  }

  getApiData();
  
});

function getWeatherStationData(data){
    
    const obs = data.observations[0];
    const lastUpdate = obs.obsTimeLocal;
    const temperature = obs.metric.temp;
    //const temperature = Math.floor(Math.random() * 51) - 10;
    const pression = obs.metric.pressure;
    const humidite = obs.humidity;
    const vent = obs.metric.windSpeed;
    const lumiere = obs.solarRadiation;
    const pluie = obs.metric.precipTotal;
    const windDir = obs.winddir;
    const windDGust = obs.metric.windGust;
    const uv = obs.uv;
    const uvPercentage = Math.min((uv / 11) * 100, 100); // max 100%

    const text = formatRelativeTime(lastUpdate);
    document.getElementById("update").textContent = `Dernière mise à jour : ${text}`;

    document.getElementById("temperature-valeur").innerHTML = `${temperature}&nbsp;<span class="unit-small">°C</span>`;
    document.getElementById("temperature-valeur").style.color = getColorForTemperature(temperature);
    document.getElementById("pression-valeur").innerHTML = `${Math.round(pression+7)}&nbsp;<span class="unit-small">hPa</span>`;
    document.getElementById("humidite-valeur").innerHTML = `${humidite}&nbsp;<span class="unit-small">%</span>`;
    document.getElementById("vent-valeur").innerHTML = `
        ${vent} km/h<br>
        ${windDGust} km/h (rafales)
    `;
    document.getElementById("wind-arrow").style.transform = `rotate(${windDir}deg)`;
    const index = Math.min(Math.floor(uv / 2), uvColors.length - 1);
    const gradientColors = uvColors.slice(0, index + 1);
    const fill = document.querySelector('.uv-bar-fill');
    fill.style.background = `linear-gradient(to right, ${gradientColors.join(", ")})`;
    fill.style.width = `${uvPercentage}%`;
    document.getElementById("pluie-valeur").innerHTML = `${pluie.toFixed(1)}&nbsp;<span class="unit-small">mm</span>`;
}

const uvColors = [
    "#03eaff",  // UV 0-1 - bleu clair
    "#0bff03",  // UV 2-3 - vert
    "#fffb03",  // UV 4-5 - jaune
    "#ff8b00",  // UV 6-7 - orange
    "#ff0303",  // UV 8-9 - rouge
    "#ff03fb"   // UV 10-11 - violet
];

function formatRelativeTime(dateString) {
    const now = new Date();
    const past = new Date(dateString.replace(" ", "T")); // pour compatibilité ISO
    const diffInSeconds = Math.floor((now - past) / 1000);
  
    if (diffInSeconds < 60) {
      return `il y a ${diffInSeconds} seconde${diffInSeconds > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
}