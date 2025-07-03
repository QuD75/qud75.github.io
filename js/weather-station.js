document.addEventListener('DOMContentLoaded', () => {

  const stationId = 'ILECRO29';
  const stationApiKey = '556a0b6740e249fdaa0b6740e2c9fdea';
  const baseUrl = 'https://api.weather.com/v2/pws/observations';
  
  const api_station_meteo = `${baseUrl}/current?stationId=${stationId}&format=json&units=m&apiKey=${stationApiKey}&numericPrecision=decimal`;
  const api_station_meteo_day = `${baseUrl}/all/1day?stationId=${stationId}&format=json&units=m&apiKey=${stationApiKey}&numericPrecision=decimal`;
  const api_station_meteo_week = `${baseUrl}/hourly/7day?stationId=${stationId}&format=json&units=m&apiKey=${stationApiKey}&numericPrecision=decimal`;

  async function getApiData() {
      fetchData(api_station_meteo, 'station_meteo', 1, getWeatherStationData);
      fetchData(api_station_meteo_day, 'station_meteo_day', 1, createGraphsDay);
      fetchData(api_station_meteo_week, 'station_meteo_week', 1, createGraphsWeek);
  }

  getApiData();

  function updateRainTitle() {
    const titre = document.getElementById('rain-title');

    if (window.innerWidth <= 768) {
      titre.textContent = "Pluie";
    } else {
      titre.textContent = "Pluviométrie du jour";
    }
  }
  updateRainTitle();
  window.addEventListener('resize', updateRainTitle);

  const select = document.getElementById("plage");
  const dayBloc = document.getElementById("day-chart");
  const weekBloc = document.getElementById("week-chart");

  function toggleBlocs() {
    const selected = select.value;

    if (selected === "day") {
      dayBloc.style.display = "grid";
      weekBloc.style.display = "none";
    } else if (selected === "week") {
      dayBloc.style.display = "none";
      weekBloc.style.display = "grid";
    }
  }

  // Mettre à jour l'affichage au chargement
  toggleBlocs();

  // Mettre à jour lors d’un changement
  select.addEventListener("change", toggleBlocs);
  
});

function getWeatherStationData(data){
    
    const obs = data.observations[0];
    const lastUpdate = obs.obsTimeLocal;
    const temperature = obs.metric.temp;
    const pression = obs.metric.pressure;
    const humidite = obs.humidity;
    const vent = obs.metric.windSpeed;
    const pluie = obs.metric.precipTotal;
    const windDir = obs.winddir;
    const windDGust = obs.metric.windGust;
    const uv = obs.uv;
    const uvPercentage = Math.min((uv / 11) * 100, 100); // max 100%

    const text = formatRelativeTime(lastUpdate);
    document.getElementById("update").textContent = `Dernière mise à jour : ${text}`;

    document.getElementById("temperature-valeur").innerHTML = `${temperature}&nbsp;<span class="unit-small">°C</span>`;
    document.getElementById("temperature-valeur").style.color = getColorForTemperature(temperature);
    document.getElementById("pression-valeur").innerHTML = `${Math.round(pression+7)}&nbsp;<span class="unit-small">hPa</span>`;
    document.getElementById("humidite-valeur").innerHTML = `${humidite}&nbsp;<span class="unit-small">%</span>`;
    document.getElementById("vent-valeur").innerHTML = `
        ${vent} km/h<br>
        ${windDGust} km/h (rafales)
    `;
    document.getElementById("wind-arrow").style.transform = `rotate(${windDir}deg)`;
    const index = Math.min(Math.floor(uv / 2), uvColors.length - 1);
    const gradientColors = uvColors.slice(0, index + 1);
    const fill = document.querySelector('.uv-bar-fill');
    fill.style.background = `linear-gradient(to right, ${gradientColors.join(", ")})`;
    fill.style.width = `${uvPercentage}%`;
    document.getElementById("pluie-valeur").innerHTML = `${pluie.toFixed(1)}&nbsp;<span class="unit-small">mm</span>`;
}

const uvColors = [
    "#03eaff",  // UV 0-1 - bleu clair
    "#0bff03",  // UV 2-3 - vert
    "#fffb03",  // UV 4-5 - jaune
    "#ff8b00",  // UV 6-7 - orange
    "#ff0303",  // UV 8-9 - rouge
    "#ff03fb"   // UV 10-11 - violet
];

function formatRelativeTime(dateString) {
    const now = new Date();
    const past = new Date(dateString.replace(" ", "T")); // pour compatibilité ISO
    const diffInSeconds = Math.floor((now - past) / 1000);
  
    if (diffInSeconds < 60) {
      return `il y a ${diffInSeconds} seconde${diffInSeconds > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
}

// Formatage des dates
const formatHour = date => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const formatDayHour = date => date.toLocaleTimeString([], { day: '2-digit', month: '2-digit', hour: '2-digit' });

// Options globales
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      font: { size: 18 }
    }
  },
  scales: {
    y: {
      title: {
        display: true
      }
    },
    x: {
      title: {
        display: true,
        text: "Heure"
      }
    }
  }
};

// Stockage des graphiques séparés pour jour et semaine
let charts = {
  day: {
    temperature: null,
    humidity: null,
    pressure: null,
    rain: null
  },
  week: {
    temperature: null,
    humidity: null,
    pressure: null,
    rain: null
  }
};

// Création générique de graphique
function createLineChart(metric, containerId, label, data, labels, unit, color, title, period) {
  if (charts[period][metric]) {
    charts[period][metric].destroy();
  }

  charts[period][metric] = new Chart(document.getElementById(containerId), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: color.border,
        backgroundColor: color.background,
        fill: true,
        tension: 0.5,
        pointRadius: 0
      }]
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          ...chartOptions.plugins.title,
          text: title
        }
      },
      scales: {
        y: {
          ...chartOptions.scales.y,
          min: unit === "mm" ? 0 : undefined,
        },
        x: chartOptions.scales.x
      }
    }
  });
}

function createWeatherCharts(data, labelsFormatter, labelSuffix, period, smooth = false) {
  const labels = data.map(d => {
    const dateStr = d.obsTimeLocal; // exemple: "2025-06-04 00:59:54"
    const date = new Date(dateStr.replace(" ", "T")); // donne un objet Date valide
    return labelsFormatter(date);
  });

  const extract = key => data.map(d => d[key] ?? d.metric?.[key] ?? 0);    
  const process = arr => smooth ? smoothData(arr) : arr;

  createLineChart("temperature", `${period}TemperatureChart`, "Température", process(extract("tempAvg")), labels, "°C", {
    border: "rgba(255, 99, 132, 1)",
    background: "rgba(255, 99, 132, 0.2)"
  }, `Température ${labelSuffix}`, period);

  createLineChart("humidity", `${period}HumidityChart`, "Humidité", process(extract("humidityAvg")), labels, "%", {
    border: "rgba(54, 162, 235, 1)",
    background: "rgba(54, 162, 235, 0.2)"
  }, `Humidité ${labelSuffix}`, period);

  createLineChart("pressure", `${period}PressureChart`, "Pression", process(extract("pressureMin")), labels, "hPa", {
    border: "rgba(255, 206, 86, 1)",
    background: "rgba(255, 206, 86, 0.2)"
  }, `Pression ${labelSuffix}`, period);

  createLineChart("rain", `${period}RainChart`, "Pluie", process(extract("precipTotal")), labels, "mm", {
    border: "rgba(75, 192, 192, 1)",
    background: "rgba(75, 192, 192, 0.2)"
  }, `Pluie ${labelSuffix}`, period);
}

function createGraphsDay(hourlyData){
    createWeatherCharts(hourlyData.observations, formatHour, "sur la journée", "day", true);
}

function createGraphsWeek(weeklyData){
    createWeatherCharts(weeklyData.observations, formatDayHour, "sur la semaine", "week", true);
}

function smoothData(data, windowSize = 3) {
  const smoothed = [];
  const halfWindow = Math.floor(windowSize / 2);
  const length = data.length;

  for (let i = 0; i < length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = i - halfWindow; j <= i + halfWindow; j++) {
      if (j >= 0 && j < length) {
        sum += data[j];
        count++;
      }
    }

    smoothed.push(sum / count);
  }

  return smoothed;
}  