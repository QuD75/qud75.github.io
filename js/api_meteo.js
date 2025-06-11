document.addEventListener('DOMContentLoaded', () => {

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 3);
    // Fonction pour formater une date en YYYY-MM-DD
    function formatDate(date) {
        return date.toISOString().split('T')[0]; // extrait juste la partie date
    }
    const startDate = formatDate(today);
    const endDate = formatDate(tomorrow);

    const stationId = 'ILECRO29';
    const stationApiKey = '556a0b6740e249fdaa0b6740e2c9fdea';
    const tidesApiKey = '8b2d7d44-469d-11f0-976d-0242ac130006-8b2d7db2-469d-11f0-976d-0242ac130006';
    
    const lat = '47.29';
    const long = '-2.52';
    //const dep = '44';
    const dep = '66';
    const urlVigilance = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/weatherref-france-vigilance-meteo-departement/records?where=domain_id=${dep}&limit=20`
    //const urlOpenMeteoDay = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day&forecast_days=2&timezone=Europe%2FBerlin`;
    //const urlOpenMeteoWeek = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_gusts_10m_max&timezone=Europe%2FBerlin`;
    const api_station_meteo = `https://api.weather.com/v2/pws/observations/current?stationId=${stationId}&format=json&units=m&apiKey=${stationApiKey}&numericPrecision=decimal`;
    const api_station_meteo_day = `https://api.weather.com/v2/pws/observations/all/1day?stationId=${stationId}&format=json&units=m&apiKey=${stationApiKey}&numericPrecision=decimal`;
    const api_station_meteo_week = `https://api.weather.com/v2/pws/observations/hourly/7day?stationId=${stationId}&format=json&units=m&apiKey=${stationApiKey}&numericPrecision=decimal`;
    //const api_tides = `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${long}&start=${startDate}&end=${endDate}`;

    // Appel aux API
    async function getApiData() {
        // Appels API indépendants
        fetchData(urlVigilance, 'vigilance', 0, displayDataVigilance, false);
        fetchData(api_station_meteo, 'station_meteo', 1, weatherStation, false);
        fetchData(api_station_meteo_day, 'station_meteo_day', 1, fetchDataWeatherStationAndCreateChartsDay, false);
        fetchData(api_station_meteo_week, 'station_meteo_week', 1, fetchDataWeatherStationAndCreateChartsWeek, false);
        fetchData(api_tides, 'tides', 120, tides, tidesApiKey, true);
    }

    async function fetchData(apiUrl, cacheKey, duration, displayFunction, header, isMock) {
        const now = Date.now();
        const cachedData = JSON.parse(localStorage.getItem(cacheKey));
        if (cachedData && (now - cachedData.timestamp < duration * 60000)) {
            displayFunction(cachedData.data);
            return cachedData.data;
        }
        try {
            // Prépare l'objet des options de fetch
            const options = {
                method: "GET",
                headers: {}
            };
            // Si un header est fourni, on l’ajoute
            if (header) {
                options.headers["Authorization"] = header;
            }
            // Lance le fetch avec ou sans headers
            let response;
            if (isMock) {
                response = {
                    ok: true,
                    json: async () => ({}) // renvoie un objet vide simulé
                };
            } else {
                response = await fetch(apiUrl, options);
            } 
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const data = await response.json();
            localStorage.setItem(cacheKey, JSON.stringify({ data: data, timestamp: now }));
            displayFunction(data);
            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données de ' + cacheKey + ':', error);
            return null;
        }
    }

    getApiData();
    
});