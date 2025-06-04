function weatherStation(data){
    const obs = data.observations[0];

    const temperature = obs.metric.temp;
    const pression = obs.metric.pressure;
    const humidite = obs.humidity;
    const vent = obs.metric.windSpeed;
    const lumiere = obs.solarRadiation;
    const pluie = obs.metric.precipTotal;
    const windDir = obs.winddir;
    const windDGust = obs.metric.windGust;
    const uv = obs.uv;
    const uvMax = 11;
    const uvPercentage = Math.min((uv / uvMax) * 100, 100); // max 100%

    document.getElementById("temperature-valeur").textContent = `${temperature} °C`;
    document.getElementById("temperature-valeur").style.color = getTemperatureColor(temperature);
    document.getElementById("pression-valeur").textContent = `${Math.round(pression+7)}&nbsp;<span class="unit-small">hPa</span>`;
    document.getElementById("humidite-valeur").textContent = `${humidite} %`;
    document.getElementById("vent-valeur").innerHTML = `
        ${vent} km/h<br>
        ${windDGust} km/h (rafales)
    `;
    document.getElementById("wind-arrow").style.transform = `rotate(${windDir}deg)`;
    document.getElementById("lumiere-valeur-nombre").innerHTML = `
        ${Math.round(lumiere)}&nbsp;<span class="unit-small">W/m²</span>
    `;
    const uvBar = document.getElementById("uv-bar");
    uvBar.style.width = `${uvPercentage}%`;
    uvBar.style.background = `linear-gradient(to right, ${uvColors.slice(0, Math.ceil(uv / 2 + 1)).join(", ")})`;
    document.getElementById("pluie-valeur").textContent = `${pluie.toFixed(1)} mm`;
  }

  const uvColors = [
    "#2c7bb6", // UV 0-2 : faible
    "#abd9e9", // UV 3-4 : modéré
    "#ffff66", // UV 5-6 : important
    "#fdae61", // UV 7-9 : fort
    "#d7191c"  // UV 10-11 : extrême
  ];