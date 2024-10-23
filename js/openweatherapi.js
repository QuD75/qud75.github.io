document.addEventListener('DOMContentLoaded', () => {

    //Constantes Icones
    const windDirectionIcons = [
        { min: 348.75, max: 360, icon: 'icons/wind/n.png' },
        { min: 0, max: 11.25, icon: 'icons/wind/n.png' },
        { min: 11.25, max: 33.75, icon: 'icons/wind/nne.png' },
        { min: 33.75, max: 56.25, icon: 'icons/wind/ne.png' },
        { min: 56.25, max: 78.75, icon: 'icons/wind/ene.png' },
        { min: 78.75, max: 101.25, icon: 'icons/wind/e.png' },
        { min: 101.25, max: 123.75, icon: 'icons/wind/ese.png' },
        { min: 123.75, max: 146.25, icon: 'icons/wind/se.png' },
        { min: 146.25, max: 168.75, icon: 'icons/wind/sse.png' },
        { min: 168.75, max: 191.25, icon: 'icons/wind/s.png' },
        { min: 191.25, max: 213.75, icon: 'icons/wind/sso.png' },
        { min: 213.75, max: 236.25, icon: 'icons/wind/so.png' },
        { min: 236.25, max: 258.75, icon: 'icons/wind/oso.png' },
        { min: 258.75, max: 281.25, icon: 'icons/wind/o.png' },
        { min: 281.25, max: 303.75, icon: 'icons/wind/ono.png' },
        { min: 303.75, max: 326.25, icon: 'icons/wind/no.png' },
        { min: 326.25, max: 348.75, icon: 'icons/wind/nno.png' }
    ]; 
    const weatherIcons = {
        "01d": "icons/weather/01d@2x.png",
        "01n": "icons/weather/01n@2x.png",
        "02d": "icons/weather/02d@2x.png",
        "02n": "icons/weather/02n@2x.png",
        "03d": "icons/weather/03d@2x.png",
        "03n": "icons/weather/03n@2x.png",
        "04d": "icons/weather/04d@2x.png",
        "04n": "icons/weather/04n@2x.png",
        "09d": "icons/weather/09d@2x.png",
        "09n": "icons/weather/09n@2x.png",
        "10d": "icons/weather/10d@2x.png",
        "10n": "icons/weather/10n@2x.png",
        "11d": "icons/weather/11d@2x.png",
        "11n": "icons/weather/11n@2x.png",
        "13d": "icons/weather/13d@2x.png",
        "13n": "icons/weather/13n@2x.png",
        "50d": "icons/weather/50d@2x.png",
        "50n": "icons/weather/50n@2x.png"
    }; 

    //Constantes API OpenWeatherMap
    const apiKey = '3019a6c49cea102650053a8919b5fa54';
    const lat = 47.2917;
    const lon = -2.5201;
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fonctions pour formater l'heure
    const formatTime_HH_mm = timestamp => new Date(timestamp * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const formatTime_HH = timestamp => new Date(timestamp * 1000).getHours() + 'h';
    const formatTime_DD_MM = timestamp => {
        const date = new Date(timestamp * 1000);  // Convertir le timestamp en millisecondes
        const jour = date.getDate();  // Obtenir le jour du mois
    
        // Tableau des mois en français
        const moisFrancais = ["jan", "fév", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];
    
        const mois = moisFrancais[date.getMonth()];  // Obtenir le mois correspondant
        return `${jour} ${mois}`;  // Retourner la date sous le format "JJ mois"
    };

    // Fonctions communes
    function createCell(type, content, style = {}) {
        const cell = document.createElement(type);
        cell.textContent = content;
        Object.assign(cell.style, style); // Appliquer les styles s'ils existent
        return cell;
    }
    function getWeatherIcon(weather) {
        return weatherIcons[weather] || "icons/question-mark.png";
    }
    function getTemperatureColor(temperature) {
        if (temperature < 0) {
            // Bleu pour les températures froides
            return `rgb(0, ${Math.round(255 + (temperature * 255 / 10))}, 255)`;
        } else if (temperature >= 0 && temperature <= 20) {
            // Vert pour les températures modérées
            return `rgb(${Math.round(255 * (temperature / 20))}, 255, 0)`;
        } else {
            // Rouge pour les températures chaudes
            return `rgb(255, ${Math.round(255 - (temperature - 20) * 255 / 15)}, 0)`;
        }
    }
    
    // Graphique de pluie 1h
    const displayPrecipitationData = (minutely) => {
        const labels = [];
        const dataPoints = [];

        minutely.forEach(data => {
            const time = formatTime_HH_mm(data.dt);
            const precipitation = parseFloat(data.precipitation.toFixed(1));

            // Ajout des données pour le graphique
            labels.push(time);
            dataPoints.push(precipitation);
        });

        // Appel à la fonction pour générer le graphique
        generateChart(labels, dataPoints);
    };
    const generateChart = (labels, dataPoints) => {
        const ctx = document.getElementById('precipitation-chart').getContext('2d');
        
        if (!labels.length || !dataPoints.length) {
            console.warn("Aucune donnée à afficher dans le graphique.");
            return;
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    data: dataPoints,
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false // Ne pas afficher la légende
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Heure' }
                    },
                    y: {
                        title: { display: true, text: 'Précipitations (mm)' },
                        beginAtZero: true
                    }
                }
            }
        });
    };

    // Tableau données horaires
    function extractWeatherHourly(hourly) {
        return hourly.slice(0, 24).map(data => {            
            return {
                day: formatTime_DD_MM(data.dt),
                hour: formatTime_HH(data.dt),
                temperature: data.temp.toFixed(0),
                rain: data.rain ? (data.rain["1h"] || 0.0) : 0.0,
                wind: data.wind_speed*3.6,
                windGust: data.wind_gust ? data.wind_gust*3.6 : 0,
                windDirection: data.wind_deg,
                pressure: data.pressure,
                weather: data.weather[0].icon
            };
        });
    }
    function displayWeatherHourly(data) {
        const daysFragment = document.createDocumentFragment();
        const hoursFragment = document.createDocumentFragment();
        const temperatureFragment = document.createDocumentFragment();
        const rainFragment = document.createDocumentFragment();
        const windFragment = document.createDocumentFragment();
        const windGustFragment = document.createDocumentFragment();
        const windDirectionFragment = document.createDocumentFragment();
        const pressureFragment = document.createDocumentFragment();
        const weatherFragment = document.createDocumentFragment();
    
        data.forEach(item => {
            // Remplir chaque fragment
            daysFragment.appendChild(createCell('th', item.day));
            hoursFragment.appendChild(createCell('th', item.hour));
            temperatureFragment.appendChild(createCell('td', item.temperature, { backgroundColor: getTemperatureColor(item.temperature) }));
            rainFragment.appendChild(createCell('td', item.rain.toFixed(1), item.rain > 0 ? { backgroundColor: '#ADD8E6' } : {}));
            windFragment.appendChild(createCell('td', item.wind.toFixed(0), { backgroundColor: getWindColor(item.wind) }));
            windGustFragment.appendChild(createCell('td', Math.max(item.windGust, item.wind).toFixed(0), { backgroundColor: getWindColor(item.windGust) }));
            const windDirectionCell = createCell('td', '', { backgroundColor: '#ADD8E6' });
            const windDirectionIcon = document.createElement('img');
            windDirectionIcon.src = getWindDirectionIcon(item.windDirection);
            windDirectionIcon.style.width = "30px";
            windDirectionIcon.style.height = "30px";
            windDirectionCell.appendChild(windDirectionIcon);
            windDirectionFragment.appendChild(windDirectionCell);
            pressureFragment.appendChild(createCell('td', item.pressure));
            const weatherCell = createCell('td', '', { backgroundColor: '#ADD8E6' });
            const weatherIcon = document.createElement('img');
            weatherIcon.src = getWeatherIcon(item.weather);
            weatherIcon.style.width = "30px";
            weatherIcon.style.height = "30px";
            weatherCell.appendChild(weatherIcon);
            weatherFragment.appendChild(weatherCell);
        });
    
        // Insérer tous les fragments dans le DOM
        document.getElementById('days-24h-row').appendChild(daysFragment);
        document.getElementById('hours-24h-row').appendChild(hoursFragment);
        document.getElementById('temperature-24h-row').appendChild(temperatureFragment);
        document.getElementById('rain-24h-row').appendChild(rainFragment);
        document.getElementById('wind-24h-row').appendChild(windFragment);
        document.getElementById('wind-gust-24h-row').appendChild(windGustFragment);
        document.getElementById('wind-direction-24h-row').appendChild(windDirectionFragment);
        document.getElementById('pressure-24h-row').appendChild(pressureFragment);
        document.getElementById('weather-24h-row').appendChild(weatherFragment);
    
        mergeDaysRow();
    }
    function getWindDirectionIcon(wind_deg) {
        const direction = windDirectionIcons.find(d => wind_deg >= d.min && wind_deg < d.max);
        return direction ? direction.icon : 'icons/question-mark.png';
    }
    function getWindColor(wind) {
        if (wind <= 20) {
            // Bleu pour le vent faible
            return `rgb(0, ${Math.round(255 * (wind / 20))}, 255)`;
        } else if (wind > 20 && wind <= 50) {
            // Vert pour le vent moyen
            return `rgb(0, 255, ${Math.round(255 - ((wind - 20) * 255 / 30))})`;
        } else {
            // Rouge pour le vent fort
            return `rgb(255, ${Math.round(255 - ((wind - 50) * 255 / 50))}, 0)`;
        }
    }
    function mergeDaysRow() {
        const daysRow = document.getElementById('days-24h-row');
        let previousCell = null;
        let colspan = 1;
        for (let i = 1; i < daysRow.children.length; i++) {
            const currentCell = daysRow.children[i];
            if (previousCell && previousCell.textContent.trim() === currentCell.textContent.trim()) {
                previousCell.colSpan = ++colspan;
                currentCell.remove();
                i--; 
            } else {
                previousCell = currentCell;
                colspan = 1;
            }
        }
    }

    // Tableau données quotidiennes
    function extractWeatherDaily(daily) {
        return daily.slice(0, 7).map(data => {            
            return {
                day: formatTime_DD_MM(data.dt),
                sunrise: formatTime_HH_mm(data.sunrise),
                sunset: formatTime_HH_mm(data.sunest),
                temp_max: data.temp.max.toFixed(0),
                temp_min: data.temp.min.toFixed(0),
                rain: data.rain ? (data.rain || 0.0) : 0.0,
                weather: data.weather[0].icon
            };
        });
    }
    function displayWeatherDaily(data) {
        const daysFragment = document.createDocumentFragment();
        const sunriseFragment = document.createDocumentFragment();
        const sunsetFragment = document.createDocumentFragment();
        const tempMaxFragment = document.createDocumentFragment();
        const tempMinFragment = document.createDocumentFragment();
        const rainFragment = document.createDocumentFragment();
        const weatherFragment = document.createDocumentFragment();
    
        data.forEach(item => {
            // Remplir chaque fragment
            daysFragment.appendChild(createCell('th', item.day));
            sunriseFragment.appendChild(createCell('td', item.sunrise));
            sunsetFragment.appendChild(createCell('td', item.sunset));
            tempMaxFragment.appendChild(createCell('td', item.temp_max, { backgroundColor: getTemperatureColor(item.temp_max) }));
            tempMinFragment.appendChild(createCell('td', item.temp_min, { backgroundColor: getTemperatureColor(item.temp_min) }));
            rainFragment.appendChild(createCell('td', item.rain.toFixed(1), item.rain > 0 ? { backgroundColor: '#ADD8E6' } : {}));
            const weatherCell = createCell('td', '', { backgroundColor: '#ADD8E6' });
            const weatherIcon = document.createElement('img');
            weatherIcon.src = getWeatherIcon(item.weather);
            weatherIcon.style.width = "30px";
            weatherIcon.style.height = "30px";
            weatherCell.appendChild(weatherIcon);
            weatherFragment.appendChild(weatherCell);
        });
    
        // Insérer tous les fragments dans le DOM
        document.getElementById('days-7d-row').appendChild(daysFragment);
        document.getElementById('sunrise').appendChild(sunriseFragment);
        document.getElementById('sunset').appendChild(sunsetFragment);
        document.getElementById('temperature-min-7d-row').appendChild(tempMinFragment);
        document.getElementById('temperature-max-7d-row').appendChild(tempMaxFragment);
        document.getElementById('rain-7d-row').appendChild(rainFragment);
        document.getElementById('weather-7d-row').appendChild(weatherFragment);
    }

    // Récupération des données météo via l'API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.minutely?.length) {
                displayPrecipitationData(data.minutely);
            }
            if (data.hourly?.length){
                displayWeatherHourly(extractWeatherHourly(data.hourly));
            }
            if (data.daily?.length){
                displayWeatherDaily(extractWeatherDaily(data.daily));
            }
        })
        .catch(error => console.error("Erreur lors de la récupération des données :", error));
});