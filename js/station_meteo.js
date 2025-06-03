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
    document.getElementById("pression-valeur").textContent = `${Math.round(pression+7)} hPa`;
    document.getElementById("humidite-valeur").textContent = `${humidite} %`;
    document.getElementById("vent-valeur").innerHTML = `
        ${vent} km/h<br>
        ${windDGust} km/h (rafales)
    `;
    document.getElementById("wind-arrow").style.transform = `rotate(${windDir}deg)`;
    document.getElementById("lumiere-valeur-nombre").innerHTML = `
        ${Math.round(lumiere)} W/m²<br>
    `;
    const uvBar = document.getElementById("uv-bar");
    uvBar.style.backgroundSize = `${uvPercent}% 100%`;
    document.getElementById("pluie-valeur").textContent = `${pluie} mm`;
  }