document.addEventListener("DOMContentLoaded", () => {
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
  
    // Mettre à jour lors d’un changement
    select.addEventListener("change", toggleBlocs);
  });
  
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
            title: {
              ...chartOptions.scales.y.title,
              text: `${label} (${unit})`
            }
          },
          x: chartOptions.scales.x
        }
      }
    });
  }
  
  function createWeatherCharts(data, labelsFormatter, labelSuffix, period, smooth = false) {
    const labels = data.map(d => labelsFormatter(new Date(d.dt * 1000)));
  
    const extract = key => data.map(d => d[key] ?? 0);
    const process = arr => smooth ? smoothData(arr) : arr;
    console.log(extract("temp"), extract("humidity"), extract("pressure"), extract("rain"));
  
    createLineChart("temperature", `${period}TemperatureChart`, "Température", process(extract("temp")), labels, "°C", {
      border: "rgba(255, 99, 132, 1)",
      background: "rgba(255, 99, 132, 0.2)"
    }, `Température ${labelSuffix}`, period);
  
    createLineChart("humidity", `${period}HumidityChart`, "Humidité", process(extract("humidity")), labels, "%", {
      border: "rgba(54, 162, 235, 1)",
      background: "rgba(54, 162, 235, 0.2)"
    }, `Humidité ${labelSuffix}`, period);
  
    createLineChart("pressure", `${period}PressureChart`, "Pression", process(extract("pressure")), labels, "hPa", {
      border: "rgba(255, 206, 86, 1)",
      background: "rgba(255, 206, 86, 0.2)"
    }, `Pression ${labelSuffix}`, period);
  
    createLineChart("rain", `${period}RainChart`, "Pluie", process(extract("rain")), labels, "mm", {
      border: "rgba(75, 192, 192, 1)",
      background: "rgba(75, 192, 192, 0.2)"
    }, `Pluie ${labelSuffix}`, period);
  }
  
  function createGraphsDay(hourlyData){
      createWeatherCharts(hourlyData, formatHour, "sur la journée", "day", true);
  }

  function createGraphsWeek(weeklyData){
      createWeatherCharts(weeklyData, formatDayHour, "sur la semaine", "week", true);
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