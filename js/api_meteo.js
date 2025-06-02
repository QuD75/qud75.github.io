document.addEventListener('DOMContentLoaded', () => {
    const lat = '47.29';
    const long = '-2.52';
    const dep = '44';
    const urlVigilance = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/weatherref-france-vigilance-meteo-departement/records?where=domain_id=${dep}&limit=20`
    const urlOpenMeteoDay = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day&forecast_days=2&timezone=Europe%2FBerlin`;
    const urlOpenMeteoWeek = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_gusts_10m_max&timezone=Europe%2FBerlin`;

    // Appel aux API
    async function getApiData() {
        // Appels API indépendants
        fetchData(urlVigilance, 'vigilance', 0, displayDataVigilance);
    }
    async function fetchData(apiUrl, cacheKey, duration, displayFunction) {
        const now = Date.cow();
        const cachedData = JSON.parse(localStorage.getItem(cacheKey));
        if (cachedData && (now - cachedData.timestamp < duration * 60000)) {
            displayFunction(cachedData.data);
            return cachedData.data;
        } else {
            try {
                const response = await fetch(apiUrl);
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
    }

    getApiData();
    
});