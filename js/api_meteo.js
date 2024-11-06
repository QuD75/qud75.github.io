document.addEventListener('DOMContentLoaded', () => {
    const lat = '47.29';
    const long = '-2.52';
    const dep = '44';
    const urlVigilance = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/weatherref-france-vigilance-meteo-departement/records?where=domain_id=${dep}&limit=20`
    const urlOpenMeteoDay = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day&forecast_days=2&timezone=Europe%2FBerlin`;
    const urlOpenMeteoWeek = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_gusts_10m_max&timezone=Europe%2FBerlin`;

    const isMobile = window.innerWidth < 1;

    const setLoadingMessageDisplay = (display) => {
        document.getElementById('loading-message-vigilance').style.display = display;
        document.getElementById('loading-message-day').style.display = display;
        document.getElementById('loading-message-week').style.display = display;
    };

    // Appel aux API
    async function getApiData() {
        setLoadingMessageDisplay('block');
        // Appels API indépendants
        fetchData(urlVigilance, 'vigilance', 60, displayDataVigilance);
        fetchData(urlOpenMeteoDay, 'day', 15, displayDataDay);
        fetchData(urlOpenMeteoWeek, 'week', 60, displayDataWeek);
    }
    async function fetchData(apiUrl, cacheKey, duration, displayFunction) {
        const now = Date.now();
        const cachedData = JSON.parse(localStorage.getItem(cacheKey));
        if (cachedData && (now - cachedData.timestamp < duration * 60 * 1000)) {
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

    //Fonctions pour le tableau 24h
    function displayDataDay(jsonData) {
        document.getElementById('loading-message-day').style.display = 'none';
        document.getElementById('day-container-graphs').style.display = 'block';

        if (!isMobile) {
            document.getElementById('day-container-tab').style.display = 'block';
            fillDayContainer(jsonData);
        } else {
            document.getElementById('day-container-tab-mobile').style.display = 'block';
        }

    }
    function fillDayContainer(jsonData) {
        const now = new Date();
        const startHour = now.getHours(); // Utilise getUTCHours pour l'heure en UTC
        const hoursToDisplay = 24; // Nombre d'heures à afficher (de l'heure actuelle jusqu'à +23 heures)

        // Récupère les heures à partir de l'heure actuelle jusqu'à +23 heures
        const times = jsonData.hourly.time.map(time => new Date(time));
        const startIndex = times.findIndex(time => time.getHours() === startHour);

        // Sélectionne les données pour les heures dans la plage souhaitée
        let timesToDisplay = times.slice(startIndex, startIndex + hoursToDisplay);
        const tempToDisplay = jsonData.hourly.temperature_2m.slice(startIndex, startIndex + hoursToDisplay);
        const rainToDisplay = jsonData.hourly.precipitation.slice(startIndex, startIndex + hoursToDisplay);
        const windSpeedToDisplay = jsonData.hourly.wind_speed_10m.slice(startIndex, startIndex + hoursToDisplay);
        const windGustToDisplay = jsonData.hourly.wind_gusts_10m.slice(startIndex, startIndex + hoursToDisplay);
        const windDirectionToDisplay = jsonData.hourly.wind_direction_10m.slice(startIndex, startIndex + hoursToDisplay);
        const pressureToDisplay = jsonData.hourly.pressure_msl.slice(startIndex, startIndex + hoursToDisplay);
        const uvToDisplay = jsonData.hourly.uv_index.slice(startIndex, startIndex + hoursToDisplay);
        const weatherToDisplay = jsonData.hourly.weather_code.slice(startIndex, startIndex + hoursToDisplay);
        const isDayToDisplay = jsonData.hourly.is_day.slice(startIndex, startIndex + hoursToDisplay);

        const daysRow = document.getElementById('days-24h-row');
        const hoursRow = document.getElementById('hours-24h-row');

        // Crée un objet pour stocker le nombre d'heures par jour
        const hoursPerDay = {};

        // Parcours des heures pour créer les cellules fusionnées pour chaque jour
        timesToDisplay.forEach(date => {
            const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
            const hour = date.getHours();

            // Si c'est un nouveau jour, on initialise la cellule de jour
            if (!hoursPerDay[dayName]) {
                hoursPerDay[dayName] = 1; // Commence le comptage des heures
                const dayCell = document.createElement('th');
                dayCell.textContent = dayName;
                dayCell.colSpan = 1; // Initialement, on ne fusionne pas
                daysRow.appendChild(dayCell);
            } else {
                hoursPerDay[dayName]++;
            }

            // Remplit les entêtes des heures
            const hourCell = document.createElement('th');
            hourCell.textContent = `${hour}h`;
            hoursRow.appendChild(hourCell);
        });

        // Met à jour la colonne des jours pour fusionner correctement
        Object.entries(hoursPerDay).forEach(([dayName, count], index) => {
            const dayCell = daysRow.children[index + 1]; //A cause de la cellule 'Paramètres'
            dayCell.colSpan = count; // Met à jour la colSpan avec le nombre d'heures

        });

        fillRow(false, 'temperature-24h-row', tempToDisplay, 0, null, getTempColor);
        fillRow(false, 'rain-24h-row', rainToDisplay, 1, null, getRainColor);
        fillRow(false, 'wind-24h-row', windSpeedToDisplay, 0, 5, getWindColor);
        fillRow(false, 'wind-gust-24h-row', windGustToDisplay, 0, 5, getWindColor);
        fillRow(false, 'pressure-24h-row', pressureToDisplay, 0, null, defaultColorFunc);
        fillRow(false, 'uv-24h-row', uvToDisplay, 0, null, getUVColor);

        // Remplit les données des différentes lignes avec symbole
        function fillWindDirSymbol(rowId, data, widht) {
            const row = document.getElementById(rowId);
            const rootStyles = getComputedStyle(document.documentElement);
            const primaryColor = rootStyles.getPropertyValue('--primary-color').trim();
            data.forEach(value => {
                
                const cell = document.createElement('td');
                const icon = document.createElement('img');
                putIconStyle(icon, widht, 'auto%', 'contain');
                icon.src = getWindDirectionIcon(value);
                cell.style.backgroundColor = 'white';
                cell.appendChild(icon);
                row.appendChild(cell);
            });
        }

        fillWindDirSymbol('wind-direction-24h-row', windDirectionToDisplay, '65%');
        fillWeatherSymbol('weather-24h-row', weatherToDisplay, '100%', isDayToDisplay);

        timesToDisplay = timesToDisplay.map(date => formatDate(date, false, false, false, true, false));
        createChartOM('temperature-day-chart', timesToDisplay, tempToDisplay, 1, 'Evolution de la température dans les prochaines 24h', 'Heure', 'Température (°C)', 0, 'line', 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)');
        createChartOM('precipitation-day-chart', timesToDisplay, rainToDisplay, 0.1, 'Evolution des précipitations dans les prochaines 24h', 'Heure', 'Pluie (mm)', 1, 'bar', 'rgba(0, 0, 139, 1)', 'rgba(0, 0, 139, 0.2)');
        createChartOM('wind-day-chart', timesToDisplay, windSpeedToDisplay, 5, 'Evolution du vent dans les prochaines 24h', 'Heure', 'Vent (km/h)', 0, 'line', 'rgba(204, 204, 0, 1)', 'rgba(255, 255, 0, 0.2)', windGustToDisplay);
        createChartOM('pressure-day-chart', timesToDisplay, pressureToDisplay, 1, 'Evolution de la pression dans les prochaines 24h', 'Heure', 'Pression (hPa)', 0, 'line', 'rgba(0, 100, 0, 1)', 'rgba(0, 100, 0, 0.2)');
    }

    //Fonctions pour le tableau semaine
    function displayDataWeek(jsonData) {
        document.getElementById('loading-message-week').style.display = 'none';
        document.getElementById('week-container-graphs').style.display = 'block';

        if (!isMobile) {
            document.getElementById('week-container-tab').style.display = 'block';
            fillWeekContainer(jsonData);
        } else {
            document.getElementById('week-container-tab-mobile').style.display = 'block';
        }

    }
    function fillWeekContainer(jsonData) {
        const times = jsonData.daily.time.map(time => new Date(time));

        // Sélectionne les données pour les heures dans la plage souhaitée
        let timesToDisplay = times;
        let sunriseToDisplay = jsonData.daily.sunrise;
        let sunsetToDisplay = jsonData.daily.sunset;
        const tempMinToDisplay = jsonData.daily.temperature_2m_min;
        const tempMaxToDisplay = jsonData.daily.temperature_2m_max;
        const rainToDisplay = jsonData.daily.precipitation_sum;
        const windGustToDisplay = jsonData.daily.wind_gusts_10m_max;
        const uvToDisplay = jsonData.daily.uv_index_max;
        const weatherToDisplay = jsonData.daily.weather_code;

        timesToDisplay = timesToDisplay.map(date => new Date(date).toLocaleDateString('fr-FR', { weekday: 'long' }));
        sunriseToDisplay = sunriseToDisplay.map(date => formatDate(new Date(date), false, false, false, true, true));
        sunsetToDisplay = sunsetToDisplay.map(date => formatDate(new Date(date), false, false, false, true, true));
        let sunTimes = [];
        sunTimes = sunriseToDisplay.map((value, index) => ' ' + value + ' - ' + sunsetToDisplay[index] + '');

        fillRow(true, 'days-week-row', timesToDisplay, null, null, defaultColorFunc);
        fillRow(false, 'sun-week-row', sunTimes, null, null, defaultColorFunc);
        fillRow(false, 'temp-min-week-row', tempMinToDisplay, 0, null, getTempColor);
        fillRow(false, 'temp-max-week-row', tempMaxToDisplay, 0, null, getTempColor);
        fillRow(false, 'rain-week-row', rainToDisplay, 1, null, getRainColor);
        fillRow(false, 'wind-week-row', windGustToDisplay, 0, 5, getWindColor);
        fillRow(false, 'uv-week-row', uvToDisplay, 0, null, getUVColor);

        fillWeatherSymbol('weather-week-row', weatherToDisplay, '100%', null);

        createChartOM('temperature-week-chart', timesToDisplay, tempMinToDisplay, 1, 'Evolution de la température dans les prochaines 24h', 'Heure', 'Température (°C)', 0, 'line', 'rgba(0, 0, 139, 1)', 'rgba(0, 0, 139, 0.2)', null, tempMaxToDisplay);
        createChartOM('precipitation-week-chart', timesToDisplay, rainToDisplay, 0.1, 'Evolution des précipitations dans les prochaines 24h', 'Heure', 'Pluie (mm)', 1, 'bar', 'rgba(0, 0, 139, 1)', 'rgba(0, 0, 139, 0.2)');
        createChartOM('wind-week-chart', timesToDisplay, windGustToDisplay, 5, 'Evolution du vent dans les prochaines 24h', 'Heure', 'Vent (km/h)', 0, 'line', 'rgba(204, 204, 0, 1)', 'rgba(255, 255, 0, 0.2)', windGustToDisplay);
    }

    // Remplit les données des différentes lignes
    function fillRow(isHeading, rowId, data, decimals, floor, colorFunction) {
        const row = document.getElementById(rowId);

        data.forEach(value => {
            const cell = document.createElement(isHeading ? 'th' : 'td');
            const { color, textColor } = colorFunction(value);
            value = roundToNearestMultiple(value, decimals, floor);
            cell.style.backgroundColor = color;
            cell.style.color = textColor;

            // Création des icônes pour chaque cellule (si applicable)
            if (rowId === 'sun-week-row') {
                const iconBefore = document.createElement('img');
                const iconAfter = document.createElement('img');
                const size = '20px';

                // Configuration de l'icône de lever de soleil
                iconBefore.src = '/icons/sun/lever-du-soleil.png';
                iconBefore.style.width = size;
                iconBefore.style.height = 'auto';

                // Configuration de l'icône de coucher de soleil
                iconAfter.src = '/icons/sun/coucher-du-soleil.png';
                iconAfter.style.width = size;
                iconAfter.style.height = 'auto';

                // Ajout des icônes avant et après le texte
                cell.appendChild(iconBefore);
                cell.appendChild(document.createTextNode(value));
                cell.appendChild(iconAfter);
            } else {
                // Si ce n'est pas la ligne des heures de lever/coucher du soleil, ajoutez seulement le texte
                cell.textContent = value;
            }

            // Ajouter la cellule au row
            row.appendChild(cell);
        });
    }

    getApiData();
});