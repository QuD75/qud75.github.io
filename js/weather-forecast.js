document.addEventListener('DOMContentLoaded', () => {

    const apiKey = 'AIzaSyAusGSh1xC3ZT0_wXG-_7VbWWCnrO6tZFg';
    const baseUrl = 'https://weather.googleapis.com/v1/forecast/hours:lookup';
    const lat = 47.29;
    const lon = -2.52;

    const weatherApi = `${baseUrl}?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}`;
    
    async function getApiData() {
        console.log(weatherApi);
        fetchData(weatherApi, 'weather_forecast', 60, getWeatherForecastData); 
    }
  
    getApiData();
    
});  

function getWeatherForecastData(data){

  const tbody = document.querySelector('tbody');

  // Regrouper les données par jour
  const grouped = {};

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
        <td>${entry.windDirection}</td>
        <td>${entry.rain}</td>
        <td style="background-color: ${getColorForUv(entry.uvi)};">${entry.uvi}</td>
        <td>${entry.weather}</td>
      `;

      tbody.appendChild(row);
    });
  }
}