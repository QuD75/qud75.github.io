const url = "https://api.weather.com/v2/pws/observations/current?stationId=ILECRO29&format=json&units=m&apiKey=556a0b6740e249fdaa0b6740e2c9fdea&numericPrecision=decimal";

fetch('https://api.weather.com/v2/pws/observations/current?stationId=ILECRO29&format=json&units=m&apiKey=556a0b6740e249fdaa0b6740e2c9fdea&numericPrecision=decimal')
  .then(res => res.json())
  .then(data => {
    const obs = data.observations[0];

    const temperature = obs.metric.temp;
    const pression = obs.metric.pressure;
    const humidite = obs.humidity;
    const vent = obs.metric.windSpeed;
    const lumiere = obs.solarRadiation;
    const pluie = obs.metric.precipTotal;

    document.getElementById("temperature-valeur").textContent = `${temperature} °C`;
    document.getElementById("temperature-valeur").style.color = getTemperatureColor(temperature);
    document.getElementById("pression-valeur").textContent = `${Math.round(pression)} hPa`;
    document.getElementById("humidite-valeur").textContent = `${humidite} %`;
    document.getElementById("vent-valeur").textContent = `${vent} km/h`;
    document.getElementById("lumiere-valeur").textContent = `${lumiere} W/m²`;
    document.getElementById("pluie-valeur").textContent = `${pluie} mm`;
  });
