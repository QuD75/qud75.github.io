document.addEventListener('DOMContentLoaded', () => {

    const apiKey = 'AIzaSyAusGSh1xC3ZT0_wXG-_7VbWWCnrO6tZFg';
    const baseUrl = 'https://weather.googleapis.com/v1/forecast/hours:lookup';
    const lat = 47.29;
    const lon = -2.52;

    const weatherApi = `${baseUrl}?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}`;
    
    async function getApiData() {
      const firstPageData = await fetchData(weatherApi, 'weather_forecast', 30, getWeatherForecastData);
      if (firstPageData.nextPageToken) {
        const weatherApiNextPage = `${weatherApi}&pageToken=${firstPageData.nextPageToken}`;
        await fetchData(weatherApiNextPage, 'weather_forecast_next_page', 30, getWeatherForecastData);
      }
      fillTab();
      createCharts();
    }
  
    getApiData();
});

// Regrouper les données par jour
const grouped = {};

function getWeatherForecastData(data){

  data.forecastHours.forEach(h => {

    const yearApi = h.displayDateTime.year;
    const monthApi = h.displayDateTime.month-1;
    const dayApi = h.displayDateTime.day;
    const hourApi = h.displayDateTime.hours;
    const date = new Date(yearApi, monthApi, dayApi, hourApi);

    const dayOptions = { day: '2-digit', month: '2-digit'};
    const day = date.toLocaleDateString('fr-FR', dayOptions);
    const hour = `${date.getHours()}h`;

    if (!grouped[day]) grouped[day] = [];
    grouped[day].push({
      hour,
      temp : Math.round(h.temperature.degrees),
      hum : h.relativeHumidity,
      pressure : Math.round(h.airPressure.meanSeaLevelMillibars),
      windSpeed : h.wind.speed.value,
      windGust : h.wind.gust.value,
      windDirection : h.wind.direction.degrees,
      rain : h.precipitation.probability.percent,
      uvi : h.uvIndex,
      weather : h.weatherCondition.type,
      isDay : h.isDaytime,
    });
  });
}

function fillTab(){

  const tbody = document.querySelector('tbody');

  // Générer les lignes du tableau avec rowspan
  for (const [day, hours] of Object.entries(grouped)) {
    hours.forEach((entry, index) => {
      const row = document.createElement("tr");

      if (index === 0) {
        const dayCell = document.createElement("td");
        dayCell.rowSpan = hours.length;
        dayCell.textContent = day;
        dayCell.style.fontWeight = 'bold';
        row.appendChild(dayCell);
      }

      row.innerHTML += `
        <td><strong>${entry.hour}</strong></td>
        <td style="background-color: ${getColorForTemperature(entry.temp)};">${entry.temp}</td>
        <td style="background-color: ${getColorForHumidity(entry.hum)};">${entry.hum}</td>
        <td>${entry.pressure}</td>
        <td style="background-color: ${getColorForWindSpeed(entry.windSpeed)};">${Math.round(entry.windSpeed / 5) * 5}</td>
        <td style="background-color: ${getColorForWindSpeed(entry.windGust)};">${Math.round(entry.windGust / 5) * 5}</td>
        <td><img src="${getWindDirectionIcon(entry.windDirection)}"></td>
        <td>${entry.rain}</td>
        <td style="background-color: ${getColorForUv(entry.uvi)};">${entry.uvi}</td>
        <td><img class="weather-icon" src="/icons/weather/${entry.isDay ? 'day' : 'night'}/${entry.weather}.svg"></td>
      `;

      tbody.appendChild(row);
    });
  }
}

function createCharts() {
  const labels = []; // ex: ['10h', '11h', ...]
  const tempData = [];
  const pressureData = [];
  const windData = [];
  const rainData = [];

  // Récupère tous les points horaires
  Object.entries(grouped).forEach(([day, hours]) => {
    hours.forEach(entry => {
      labels.push(`${day} ${entry.hour}`);
      tempData.push(entry.temp);
      pressureData.push(entry.pressure);
      windData.push(entry.windSpeed);
      rainData.push(entry.rain);
    });
  });

  // Température
  new Chart(document.getElementById('chart-temperature-day'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Température (°C)',
        data: tempData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3
      }]
    }
  });

  // Pression
  new Chart(document.getElementById('chart-pressure-day'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Pression (hPa)',
        data: pressureData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3
      }]
    }
  });

  // Vent
  new Chart(document.getElementById('chart-wind-day'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Vent (km/h)',
        data: windData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3
      }]
    }
  });

  // Pluie
  new Chart(document.getElementById('chart-rain-day'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Pluie (%)',
        data: rainData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1
      }]
    }
  });
}