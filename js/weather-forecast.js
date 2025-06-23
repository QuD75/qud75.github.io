import { fr } from "date-fns/locale/fr";
import "chartjs-adapter-date-fns";
import Chart from "chart.js";

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

function fillTab(){

  const tbody = document.querySelector('tbody');

  // Générer les lignes du tableau avec rowspan
  for (const [day, hours] of Object.entries(grouped)) {
    hours.forEach((entry, index) => {
      const row = document.createElement("tr");

      if (index === 0) {
        const dayCell = document.createElement("td");
        dayCell.rowSpan = hours.length;
        dayCell.textContent = day;
        dayCell.style.fontWeight = 'bold';
        row.appendChild(dayCell);
      }

      row.innerHTML += `
        <td><strong>${entry.hour}</strong></td>
        <td style="background-color: ${getColorForTemperature(entry.temp)};">${entry.temp}</td>
        <td style="background-color: ${getColorForHumidity(entry.hum)};">${entry.hum}</td>
        <td>${entry.pressure}</td>
        <td style="background-color: ${getColorForWindSpeed(entry.windSpeed)};">${Math.round(entry.windSpeed / 5) * 5}</td>
        <td style="background-color: ${getColorForWindSpeed(entry.windGust)};">${Math.round(entry.windGust / 5) * 5}</td>
        <td><img src="${getWindDirectionIcon(entry.windDirection)}"></td>
        <td>${entry.rain}</td>
        <td style="background-color: ${getColorForUv(entry.uvi)};">${entry.uvi}</td>
        <td><img class="weather-icon" src="/icons/weather/${entry.isDay ? 'day' : 'night'}/${entry.weather}.svg"></td>
      `;

      tbody.appendChild(row);
    });
  }
}

function createCharts() {
  const tempData = [];
  const pressureData = [];
  const windData = [];
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
          font: { size: 18 }
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
            unit: 'hour',
            tooltipFormat: "EEEE HH'h'",
            displayFormats: {
              hour: "EEEE HH'h'"
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
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointRadius: 0
      }]
    },
    ...commonOptions('Pression (hPa)')
  });

  // Vent
  new Chart(document.getElementById('chart-wind-day'), {
    data: {
      datasets: [{
        label: 'Vent',
        data: windData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1
      }]
    },
    ...commonOptions('Pluie (%)', 'bar'),
    options: {
      ...commonOptions('Pluie (%)', 'bar').options,
      scales: {
        ...commonOptions('Pluie (%)', 'bar').options.scales,
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 10
          }
        }
      }
    }
  });
}