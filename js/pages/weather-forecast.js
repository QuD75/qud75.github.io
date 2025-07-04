import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
Chart.defaults.animation = false;

import { fr } from 'date-fns/locale/fr';
import 'chartjs-adapter-date-fns';

document.addEventListener('DOMContentLoaded', () => {

    const apiKey = 'AIzaSyAusGSh1xC3ZT0_wXG-_7VbWWCnrO6tZFg';
    const baseUrl = 'https://weather.googleapis.com/v1/forecast';
    const lat = 47.29;
    const lon = -2.52;

    const weatherDay = `${baseUrl}/hours:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}`;
    const weatherWeek = `${baseUrl}/days:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}&days=7&pageSize=7`;
    
    async function initForecast() {

      const firstPageData = await fetchData(weatherDay, 'weather_forecast_day', 120, getWeatherForecastHoursData);
      if (firstPageData.nextPageToken) {
        const weatherApiNextPage = `${weatherDay}&pageToken=${firstPageData.nextPageToken}`;
        await fetchData(weatherApiNextPage, 'weather_forecast_day_next_page', 120, getWeatherForecastHoursData);
      }

      await fetchData(weatherWeek, 'weather_forecast_week', 120, getWeatherForecastDaysData);
      
      fillTabDays();
      createCharts();

      document.getElementById('forecast-loading-message').style.display = 'none';  
      document.querySelectorAll('h2').forEach(h2 => {
        h2.style.display = 'block';
      });
      const forecastDay = document.getElementById('forecast-day-container');
      forecastDay.style.display = window.innerWidth <= 1024 ? 'block' : 'flex';
      document.getElementById('forecast-week-container').style.display = 'block';
      if (window.innerWidth <= 768) {
        createCompactMobileForecast();
      }
    }
  
    initForecast();
});

// Regrouper les données par jour
const grouped = {};

function getWeatherForecastHoursData(dataDays){
  dataDays.forecastHours.forEach(h => {

    const yearApi = h.displayDateTime.year;
    const monthApi = h.displayDateTime.month-1;
    const dayApi = h.displayDateTime.day;
    const hourApi = h.displayDateTime.hours;
    const date = new Date(yearApi, monthApi, dayApi, hourApi);

    const day = date.toLocaleDateString('fr-CA');
    const hour = `${date.getHours()}h`;

    if (!grouped[day]) grouped[day] = [];
    grouped[day].push({
      timestamp: date.getTime() / 1000,
      hour,
      temp: h.temperature.degrees,
      hum: h.relativeHumidity,
      pressure: h.airPressure.meanSeaLevelMillibars,
      windSpeed: h.wind.speed.value,
      windGust: h.wind.gust.value,
      windDirection: h.wind.direction.degrees,
      rain: h.precipitation.qpf.quantity,
      uvi: h.uvIndex,
      weather: h.weatherCondition.type,
      isDay: h.isDaytime,
    });
  });
}

function fillTabDays() {
  const tbody = document.getElementById('forecast-day-tbody');

  for (const [day, hours] of Object.entries(grouped)) {
    hours.forEach((entry, index) => {
      const row = document.createElement('tr');

      if (index === 0) {
        const dayCell = document.createElement('td');
        dayCell.rowSpan = hours.length;
        dayCell.textContent = new Date(day).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        dayCell.style.fontWeight = 'bold';
        row.appendChild(dayCell);
      }

      // Cellule heure
      const hourCell = document.createElement('td');
      hourCell.innerHTML = `<strong>${entry.hour}</strong>`;
      row.appendChild(hourCell);

      // Température
      const tempCell = document.createElement('td');
      const tempBg = getColorForTemperature(entry.temp);
      tempCell.style.backgroundColor = tempBg;
      tempCell.style.color = getTextColorFromBackground(tempBg);
      tempCell.textContent = `${Math.round(entry.temp)}°C`;
      row.appendChild(tempCell);

      // Pression
      const pressureCell = document.createElement('td');
      pressureCell.textContent = Math.round(entry.pressure);
      row.appendChild(pressureCell);

      // Vent vitesse
      const windSpeedCell = document.createElement('td');
      const windSpeedBg = getColorForWindSpeed(entry.windSpeed);
      windSpeedCell.style.backgroundColor = windSpeedBg;
      windSpeedCell.style.color = getTextColorFromBackground(windSpeedBg);
      windSpeedCell.textContent = Math.round(entry.windSpeed / 5) * 5;
      row.appendChild(windSpeedCell);

      // Vent rafale
      const windGustCell = document.createElement('td');
      const windGustBg = getColorForWindSpeed(entry.windGust);
      windGustCell.style.backgroundColor = windGustBg;
      windGustCell.style.color = getTextColorFromBackground(windGustBg);
      windGustCell.textContent = Math.round(entry.windGust / 5) * 5;
      row.appendChild(windGustCell);

      // Direction vent (image)
      const windDirCell = document.createElement('td');
      const imgDir = document.createElement('img');
      imgDir.src = getWindDirectionIcon(entry.windDirection);
      windDirCell.appendChild(imgDir);
      row.appendChild(windDirCell);

      // Pluie
      const rainCell = document.createElement('td');
      const rainBg = getColorForRain(entry.rain);
      rainCell.style.backgroundColor = rainBg;
      rainCell.style.color = getTextColorFromBackground(rainBg);
      const rainRounded = Math.round(entry.rain * 10) / 10;
      rainCell.textContent = `${(rainRounded % 1 === 0) ? rainRounded.toString() : rainRounded.toFixed(1)} mm`;
      row.appendChild(rainCell);

      // Uv
      const uvCell = document.createElement('td');
      const uvBg = getColorForUv(entry.uvi);
      uvCell.style.backgroundColor = uvBg;
      uvCell.style.color = getTextColorFromBackground(uvBg);
      uvCell.textContent = entry.uvi;
      row.appendChild(uvCell);

      // Icône météo
      const weatherCell = document.createElement('td');
      const imgWeather = document.createElement('img');
      imgWeather.classList.add('weather-day-icon');
      imgWeather.src = `/icons/weather/${entry.isDay ? 'day' : 'night'}/${entry.weather}.svg`;
      weatherCell.appendChild(imgWeather);
      row.appendChild(weatherCell);

      tbody.appendChild(row);
    });
  }
}

function getWeatherForecastDaysData(dataWeek) {
  const theadRow = document.querySelector('#forecast-week-table thead tr');
  const tbodyRows = Array.from(document.querySelectorAll('#forecast-week-table tbody tr'));

  const days = dataWeek.forecastDays;
  const timeZone = dataWeek.timeZone?.id || 'Europe/Paris';

  const formatDateClean = (dateObj) => {
    const date = new Date(Date.UTC(dateObj.year, dateObj.month - 1, dateObj.day));

    const fullDate = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone
    });

    return fullDate.toLowerCase();
  };

  const formatHour = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const localDate = new Date(date.toLocaleString('en-US', { timeZone }));
    const h = localDate.getHours();
    const m = localDate.getMinutes().toString().padStart(2, '0');
    return `${h}h${m}`;
  };

  days.forEach(day => {

    const d = day.daytimeForecast;
    const n = day.nighttimeForecast;

    const sunrise = day.sunEvents.sunriseTime
      ? formatHour(new Date(day.sunEvents.sunriseTime), timeZone)
      : '—';

    const sunset = day.sunEvents.sunsetTime
      ? formatHour(new Date(day.sunEvents.sunsetTime), timeZone)
      : '—';

    const minTemp = Math.round(day.minTemperature.degrees);
    const maxTemp = Math.round(day.maxTemperature.degrees);
    const avgWind = Math.round((d.wind.speed.value + n.wind.speed.value) / 2);
    const windDirection = d.wind.direction.degrees;
    const rain = d.precipitation.qpf.quantity + n.precipitation.qpf.quantity;

    // Ajouter l'en-tête du jour dans le thead
    const th = document.createElement('th');
    th.textContent = formatDateClean(day.displayDate);
    theadRow.appendChild(th);

    // Ligne 0 : icône météo
    const td0 = document.createElement('td');
    const imgWeather = document.createElement('img');
    imgWeather.src = `/icons/weather/day/${d.weatherCondition.type}.svg`;
    imgWeather.alt = d.weatherCondition.type;
    imgWeather.classList.add('weather-week-icon');
    td0.appendChild(imgWeather);
    tbodyRows[0].appendChild(td0);

    // Ligne 1 : Lever / coucher soleil
    const divSun = document.createElement('div');
    divSun.id = 'sun-times';
    const td1 = document.createElement('td');
    const spanSunrise = document.createElement('span');
    spanSunrise.id = 'badge-sunrise';
    spanSunrise.textContent = sunrise;
    const spanSunset = document.createElement('span');
    spanSunset.id = 'badge-sunset';
    spanSunset.textContent = sunset;
    divSun.append(spanSunrise, spanSunset);
    td1.appendChild(divSun);
    tbodyRows[1].appendChild(td1);

    // Ligne 2 : Températures min / max (badges)
    const td2 = document.createElement('td');
    const spanTempMin = document.createElement('span');
    spanTempMin.className = 'badge';
    spanTempMin.textContent = `${minTemp}`;
    spanTempMin.style.backgroundColor = getColorForTemperature(minTemp);
    spanTempMin.style.color = getTextColorFromBackground(spanTempMin.style.backgroundColor);
    const spanTempMax = document.createElement('span');
    spanTempMax.className = 'badge';
    spanTempMax.textContent = `${maxTemp}`;
    spanTempMax.style.backgroundColor = getColorForTemperature(maxTemp);
    spanTempMax.style.color = getTextColorFromBackground(spanTempMax.style.backgroundColor);
    td2.append(spanTempMin, spanTempMax);
    tbodyRows[2].appendChild(td2);

    // Ligne 3 : Vent moyen
    const divWind = document.createElement('div');
    divWind.id = 'wind';
    const td3 = document.createElement('td');
    const spanWind = document.createElement('span');
    spanWind.className = 'badge';
    spanWind.style.backgroundColor = getColorForWindSpeed(avgWind);
    spanWind.style.color = getTextColorFromBackground(spanWind.style.backgroundColor);
    spanWind.textContent = '';
    const iconName = getWindDirectionIcon(windDirection);
    const imgIcon = document.createElement('img');
    imgIcon.src = iconName;
    imgIcon.id = 'wind-direction-arrow-week'
    spanWind.appendChild(imgIcon);
    const spanValue = document.createElement('span');
    spanValue.id = 'wind-speed-value-week'
    spanValue.textContent = `${Math.round(avgWind / 5) * 5} km/h`;
    divWind.append(spanWind, spanValue);
    td3.appendChild(divWind);
    tbodyRows[3].appendChild(td3);

    // Ligne 4 : pluie
    const divRain = document.createElement('div');
    divRain.id = 'rain';
    const td4 = document.createElement('td');
    const spanRain = document.createElement('span');
    spanRain.className = 'badge'; 
    spanRain.id = 'badge-rain';
    spanRain.style.backgroundColor = getColorForRain(rain);
    spanRain.style.color = getTextColorFromBackground(spanRain.style.backgroundColor);
    const rainRounded = Math.round(rain * 10) / 10;
    spanRain.textContent = `${(rainRounded % 1 === 0) ? rainRounded.toString() : rainRounded.toFixed(1)} mm`;
    divRain.appendChild(spanRain);
    td4.appendChild(divRain);
    tbodyRows[4].appendChild(td4);
  });
}

function createCompactMobileForecast() {
  const table = document.getElementById('forecast-week-table');
  if (!table) return;

  const thead = table.querySelector('thead tr');
  const tbody = table.querySelectorAll('tbody tr');

  const dayHeaders = Array.from(thead.querySelectorAll('th')).slice(1);

  const mobileContainer = document.createElement('div');
  mobileContainer.className = 'forecast-week-compact';

  for (let dayIndex = 0; dayIndex < dayHeaders.length; dayIndex++) {
    const dayBlock = document.createElement('div');
    dayBlock.className = 'forecast-compact-row';

    // Titre : nom du jour
    const h3 = document.createElement('h3');
    h3.textContent = dayHeaders[dayIndex].textContent;
    dayBlock.appendChild(h3);

    // Regroupe toutes les valeurs de ce jour
    const valuesDiv = document.createElement('div');
    valuesDiv.className = 'forecast-compact-values';

    const classes = ['span-weather', 'span-sun', 'span-temp', 'span-wind', 'span-rain'];

    tbody.forEach((tr, index) => {
      const cell = tr.querySelectorAll('td')[dayIndex];
      if (cell) {
        const span = document.createElement('span');
        span.innerHTML = cell.innerHTML;

        if (classes[index]) {
          span.id = classes[index];
        }

        valuesDiv.appendChild(span);
      }
    });

    dayBlock.appendChild(valuesDiv);
    mobileContainer.appendChild(dayBlock);
  }

  table.parentNode.insertBefore(mobileContainer, table.nextSibling);
}

function createCharts() {
  const tempData = [];
  const pressureData = [];
  const windData = [];
  const windGustData = [];
  const rainData = [];
  
  const dayChangeTimestamps = [];

  Object.entries(grouped).forEach(([dayKey, hours]) => {
    const dayStartTimestamp = new Date(dayKey + 'T00:00:00').getTime();
    dayChangeTimestamps.push(dayStartTimestamp);
  
    hours.forEach((entry) => {
      const timestampMs = entry.timestamp * 1000;
      tempData.push({ x: timestampMs, y: entry.temp });
      pressureData.push({ x: timestampMs, y: entry.pressure });
      windData.push({ x: timestampMs, y: entry.windSpeed });
      windGustData.push({ x: timestampMs, y: entry.windGust });
      rainData.push({ x: timestampMs, y: entry.rain });
    });
  });

  // Plugin pour ajouter des lignes verticales séparant les jours
  const daySeparationPlugin = {
    id: 'daySeparator',
    afterDraw(chart) {
      const ctx = chart.ctx;
      const xAxis = chart.scales['x'];
      const top = chart.chartArea.top;
      const bottom = chart.chartArea.bottom;
      const timestamps = chart.options.dayChangeTimestamps || [];
  
      timestamps.forEach(ts => {
        const x = xAxis.getPixelForValue(ts);
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(6, 3, 3, 0.2)';
        ctx.lineWidth = 1;
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
        ctx.stroke();
        ctx.restore();
      });
    }
  };

  const commonOptions = (titleText, type = 'line', forceNonNegativeY = false) => ({
    type,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      dayChangeTimestamps,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: titleText,
          font: { size: 14 }
        }
      },
      elements: {
        line: {
          tension: 0.5,
          cubicInterpolationMode: 'monotone'
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'EEEE'
            }
          },
          adapters: {
            date: {
              locale: fr
            }
          }
        },
        y: {
          ...(forceNonNegativeY && {
            beginAtZero: true,
            min: 0
          }),
          ticks: {
            callback: value => Number.isInteger(value) ? value : '',
            stepSize: 1
          },
          grace: '10%' // Ajoute un petit espace au-dessus de la plus grande valeur
        }
      }
    },
    plugins: [daySeparationPlugin]
  });

  // Température
  new Chart(document.getElementById('chart-temperature-day'), {
    data: {
      datasets: [{
        label: 'Température',
        data: tempData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointRadius: 0
      }]
    },
    ...commonOptions('Température (°C)', 'line', false)
  });

  // Pression
  new Chart(document.getElementById('chart-pressure-day'), {
    data: {
      datasets: [{
        label: 'Pression',
        data: pressureData,
        borderColor: 'rgb(75, 192, 192)',
        pointRadius: 0
      }]
    },
    ...commonOptions('Pression (hPa)', 'line', false)
  });

  // Vent
  new Chart(document.getElementById('chart-wind-day'), {
    data: {
      datasets: [{
        label: 'Vent moyen',
        data: windData,
        borderColor: 'rgba(255, 206, 86, 1)',
        pointRadius: 0
      },
      {
        label: 'Vent rafales',
        data: windGustData,
        borderColor: 'rgb(255, 94, 0)',
        pointRadius: 0
      }]
    },
    ...commonOptions('Vent (km/h)', 'line', true)
  });

  // Pluie (bar chart, sans tension)
  new Chart(document.getElementById('chart-rain-day'), {
    data: {
      datasets: [{
        label: 'Pluie',
        data: rainData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 0
      }]
    },
    ...commonOptions('Pluie (mm)', 'line', true)
  });  
}