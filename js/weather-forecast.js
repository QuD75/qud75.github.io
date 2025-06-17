document.addEventListener('DOMContentLoaded', () => {

    const apikey = '3019a6c49cea102650053a8919b5fa54';
    const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall';
    const lat = 47.29;
    const lon = -2.52;
    const exclude = 'current,minutely,alerts';

    const weatherForecastApi = `${baseUrl}?lat=${lat}&lon=${lon}&exclude={part}&appid=${apikey}`;
  
    async function getApiData() {
        fetchData(weatherForecastApi, 'weather_forecast', 0, getWeatherForecastData);
    }
  
    getApiData();
    
});

function getWeatherForecastData(data){
    const tbody = document.querySelector('tbody');

    data.hourly.forEach(h => {
        const d = new Date(h.dt * 1000);
        const hour = d.toLocaleString('fr-FR', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit',
          timeZone: data.timezone
        });
    
        // conversion Kelvin -> °C
        const tempC = (h.temp - 273.15).toFixed(1);
    
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${hour}</td>
          <td>${tempC}</td>
          <td>${h.humidity}</td>
          <td>${h.pressure}</td>
          <td>${h.wind_speed.toFixed(1)}</td>
          <td>${h.uvi.toFixed(1)}</td>
          <td>${h.weather[0].description}</td>
        `;
        tbody.appendChild(row);
      });

}