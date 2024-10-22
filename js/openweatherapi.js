document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '3019a6c49cea102650053a8919b5fa54';
    const lat = 47.2917;
    const lon = -2.5201;

    // URL de l'API OpenWeatherMap
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fonctions pour formater l'heure
    const formatTimeGraphiqueHeure = timestamp => new Date(timestamp * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const formatTimeWeather24h = timestamp => new Date(timestamp * 1000).getHours() + 'h';
    const formatDayWeather = timestamp => {
        const date = new Date(timestamp * 1000);  // Convertir le timestamp en millisecondes
        const jour = date.getDate();  // Obtenir le jour du mois
    
        // Tableau des mois en français
        const moisFrancais = ["jan", "fév", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];
    
        const mois = moisFrancais[date.getMonth()];  // Obtenir le mois correspondant
        return `${jour} ${mois}`;  // Retourner la date sous le format "JJ mois"
    };
    
    // Fonction pour générer le graphique
    const displayPrecipitationData = (minutely) => {
        const labels = [];
        const dataPoints = [];

        minutely.forEach(data => {
            const time = formatTimeGraphiqueHeure(data.dt);
            const precipitation = parseFloat(data.precipitation.toFixed(1));

            // Ajout des données pour le graphique
            labels.push(time);
            dataPoints.push(precipitation);
        });

        // Appel à la fonction pour générer le graphique
        generateChart(labels, dataPoints);
    };

    // Fonction pour afficher le graphique
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

    // Fonction pour extraire les données 24h
    function extractWeather24h(hourly) {
        return hourly.slice(0, 24).map(data => {
            const temperature = data.temp.toFixed(1); // Température
            const rain = data.rain ? (data.rain["1h"] || 0.0) : 0.0;
            const wind = data.wind_speed*3.6;
            const windGust = data.wind_gust ? data.wind_gust*3.6 : 0;
            const windDirection = data.wind_deg;
            const pressure = data.pressure;
            const weather = data.weather[0].icon;
            
            return {
                day: formatDayWeather(data.dt),
                hour: formatTimeWeather24h(data.dt),
                temperature,
                rain,
                wind,
                windGust,
                windDirection,
                pressure,
                weather
            };
        });
    }

    // Fonction pour afficher les données dans le tableau HTML
    function displayWeatherData(data) {
        const daysRow = document.getElementById('days-row');
        const hoursRow = document.getElementById('hours-row');
        const temperatureRow = document.getElementById('temperature-row');
        const rainRow = document.getElementById('rain-row');
        const windRow = document.getElementById('wind-row');
        const windGustRow = document.getElementById('wind-gust-row');
        const windDirectionRow = document.getElementById('wind-direction-row');
        const pressureRow = document.getElementById('pressure-row');
        const weatherRow = document.getElementById('weather-row');

        data.forEach(item => {
            const dayCell = document.createElement('th');
            dayCell.textContent = item.day;
            daysRow.appendChild(dayCell);

            const hourCell = document.createElement('th');
            hourCell.textContent = item.hour;
            hoursRow.appendChild(hourCell);

            const tempCell = document.createElement('td');
            tempCell.style.backgroundColor = getTemperatureColor(item.temperature);
            tempCell.textContent = item.temperature;
            temperatureRow.appendChild(tempCell);

            const rainCell = document.createElement('td');
            rainCell.textContent = item.rain.toFixed(1);
            if (item.rain > 0) {
                rainCell.style.backgroundColor = '#ADD8E6'; // Bleu clair
            }
            rainRow.appendChild(rainCell);

            const windCell = document.createElement('td');
            windCell.style.backgroundColor = getWindColor(item.wind);
            windCell.textContent = item.wind.toFixed(0);
            windRow.appendChild(windCell);

            const windGustCell = document.createElement('td');
            windGustCell.style.backgroundColor = getWindColor(item.windGust);
            windGustCell.textContent = (Math.max(item.windGust, item.wind)).toFixed(0);
            windGustRow.appendChild(windGustCell);

            const windDirectionCell = document.createElement('td');
            windDirectionCell.style.backgroundColor = '#ADD8E6'; // Bleu clair
            const windDirectionIcon = document.createElement('img');
            windDirectionIcon.style.width = "30px";
            windDirectionIcon.style.height = "30px";
            windDirectionIcon.src = getWindDirectionIcon(data.windDirection);
            windDirectionCell.appendChild(windDirectionIcon);
            windDirectionRow.appendChild(windDirectionCell);

            const pressionCell = document.createElement('td');
            pressionCell.textContent = item.pressure;
            pressureRow.appendChild(pressionCell);

            const weatherCell = document.createElement('td');
            weatherCell.style.backgroundColor = '#ADD8E6'; // Bleu clair
            const weatherIcon = document.createElement('img');
            weatherIcon.style.width = "30px";
            weatherIcon.style.height = "30px";
            weatherIcon.src(getWeatherIcon(data.weather));
            
            weatherCell.appendChild(weatherIcon);
            weatherRow.appendChild(weatherCell);
        });

        mergeDaysRow();
    }

    function getWeatherIcon(weather){
        if (weather === "01d") return "icons/01d@2x.png";
        else if (weather === "01n") return "icons/weather/01n@2x.png";
        else if (weather === "02d") return "icons/weather/02d@2x.png";
        else if (weather === "02n") return "icons/weather/02n@2x.png";
        else if (weather === "03d") return "icons/weather/03d@2x.png";
        else if (weather === "03n") return "icons/weather/03n@2x.png";
        else if (weather === "04d") return "icons/weather/04d@2x.png";
        else if (weather === "04n") return "icons/weather/04n@2x.png";
        else if (weather === "09d") return "icons/weather/09d@2x.png";
        else if (weather === "09n") return "icons/weather/09n@2x.png";
        else if (weather === "10d") return "icons/weather/10d@2x.png";
        else if (weather === "10n") return "icons/weather/10n@2x.png";
        else if (weather === "11d") return "icons/weather/11d@2x.png";
        else if (weather === "11n") return "icons/weather/11n@2x.png";
        else if (weather === "13d") return "icons/weather/13d@2x.png";
        else if (weather === "13n") return "icons/weather/13n@2x.png";
        else if (weather === "50d") return "icons/weather/50d@2x.png";
        else if (weather === "50n") return "icons/weather/50n@2x.png";
        else return "icons/question-mark.png";
    }

    function getWindDirectionIcon(wind_deg) {
        const directions = [
            { min: 348.75, max: 360, icon: 'icons/wind/n.png' },
            { min: 0, max: 11.25, icon: 'icons/wind/n' },
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
    
        for (const direction of directions) {
            if (wind_deg >= direction.min && wind_deg < direction.max) {
                return direction.icon;
            }
        }
    
        return 'icons/question-mark.png';
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
        const daysRow = document.getElementById('days-row');
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
                displayWeatherData(extractWeather24h(data.hourly));
            }
        })
        .catch(error => console.error("Erreur lors de la récupération des données :", error));
});
