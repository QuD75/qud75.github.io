document.addEventListener('DOMContentLoaded', () => {

    const apiKey = 'e0e611ffab773b1d4a1d6355862317ec39ea907e1f590a10a01ae07cc49ea9d8';
    const baseUrl = 'https://weather.googleapis.com/v1/forecast/hours:lookup';
    const lat = 47.29;
    const lon = -2.52;

    const weatherApi = `${baseUrl}?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}`;
    
    async function getApiData() {
        fetchData(weatherApi, 'weather_forecast', 0, getWeatherForecastData); 
    }
  
    getApiData();
    
});  

function getWeatherForecastData(data){
  console.log("Processing weather forecast data");
}