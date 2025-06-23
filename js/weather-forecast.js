import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

import { fr } from "date-fns/locale/fr";
import "chartjs-adapter-date-fns";

document.addEventListener('DOMContentLoaded', () => {

    const apiKey = 'AIzaSyAusGSh1xC3ZT0_wXG-_7VbWWCnrO6tZFg';
    const baseUrl = 'https://weather.googleapis.com/v1/forecast/hours:lookup';
    const lat = 47.29;
    const lon = -2.52;

    const weatherApi = `${baseUrl}?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}`;
    
    async function getApiData() {
      const firstPageData = await fetchData(weatherApi, 'weather_forecast', 30, getWeatherForecastData);
      if (firstPageData.nextPageToken) {
        const weatherApiNextPage = `${weatherApi}&pageToken=${firstPageData.nextPageToken}`;
        await fetchData(weatherApiNextPage, 'weather_forecast_next_page', 30, getWeatherForecastData);
      }
      fillTab();
      createCharts();
    }
  
    getApiData();
});

// Regrouper les données par jour
const grouped = {};

function getWeatherForecastData(data){

  data.forecastHours.forEach(h => {

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
      temp: Math.round(h.temperature.degrees),
      hum: h.relativeHumidity,
      pressure: Math.round(h.airPressure.meanSeaLevelMillibars),
      windSpeed: h.wind.speed.value,
      windGust: h.wind.gust.value,
      windDirection: h.wind.direction.degrees,
      rain: h.precipitation.probability.percent,
      uvi: h.uvIndex,
      weather: h.weatherCondition.type,
      isDay: h.isDaytime,
    });
  });
}

function fillTab() {
  const tbody = document.querySelector('tbody');

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
      tempCell.textContent = entry.temp;
      row.appendChild(tempCell);

      // Humidité
      const humCell = document.createElement('td');
      const humBg = getColorForHumidity(entry.hum);
      humCell.style.backgroundColor = humBg;
      humCell.style.color = getTextColorFromBackground(humBg);
      humCell.textContent = entry.hum;
      row.appendChild(humCell);

      // Pression
      const pressureCell = document.createElement('td');
      pressureCell.textContent = entry.pressure;
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
      rainCell.textContent = entry.rain;
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
      imgWeather.classList.add('weather-icon');
      imgWeather.src = `/icons/weather/${entry.isDay ? 'day' : 'night'}/${entry.weather}.svg`;
      weatherCell.appendChild(imgWeather);
      row.appendChild(weatherCell);

      tbody.appendChild(row);
    });
  }
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

  const commonOptions = (titleText, type = 'line') => ({
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
              day: "EEEE"
            }
          },
          adapters: {
            date: {
              locale: fr
            }
          }
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
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        pointRadius: 0
      }]
    },
    ...commonOptions('Température (°C)')
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
    ...commonOptions('Pression (hPa)')
  });

  // Vent
  new Chart(document.getElementById('chart-wind-day'), {
    data: {
      datasets: [{
        label: 'Vent moyen',
        data: windData,
        borderColor: "rgba(255, 206, 86, 1)",
        pointRadius: 0
      },
      {
        label: 'Vent rafales',
        data: windGustData,
        borderColor: "rgb(255, 94, 0)",
        pointRadius: 0
      }]
    },
    ...commonOptions('Vent (km/h)')
  });

  // Pluie (bar chart, sans tension)
  new Chart(document.getElementById('chart-rain-day'), {
    data: {
      datasets: [{
        label: 'Pluie',
        data: rainData,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      dayChangeTimestamps,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Pluie (%)",
          font: { size: 14 }
        }
      },
      scales: {
        x: {
          type: 'bar',
          time: {
            unit: 'day',
            displayFormats: {
              day: "EEEE"
            }
          },
          adapters: {
            date: {
              locale: fr
            }
          }
        },
        y: {
          min: 0,
          max: 100
        }
      },
      elements: {
        line: { tension: 0.5, cubicInterpolationMode: 'monotone' }
      },
      plugins: [daySeparationPlugin]
    }
  });
}