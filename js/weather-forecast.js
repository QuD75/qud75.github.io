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

}