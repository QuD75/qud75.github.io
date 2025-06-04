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
    //const uv = obs.uv;
    const uv = 2;
    const uvMax = 11;
    const uvPercentage = Math.min((uv / uvMax) * 100, 100); // max 100%

    document.getElementById("temperature-valeur").innerHTML = `${temperature}&nbsp;<span class="unit-small">°C</span>`;
    document.getElementById("temperature-valeur").style.color = getTemperatureColor(temperature);
    document.getElementById("pression-valeur").innerHTML = `${Math.round(pression+7)}&nbsp;<span class="unit-small">hPa</span>`;
    document.getElementById("humidite-valeur").innerHTML = `${humidite}&nbsp;<span class="unit-small">%</span>`;
    document.getElementById("vent-valeur").innerHTML = `
        ${vent} km/h<br>
        ${windDGust} km/h (rafales)
    `;
    document.getElementById("wind-arrow").style.transform = `rotate(${windDir}deg)`;
    document.getElementById("lumiere-valeur-nombre").innerHTML = `
        ${Math.round(lumiere)}&nbsp;<span class="unit-small">W/m²</span>
    `;
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
    "#ff8503",  // UV 6-7 - orange
    "#ff0303",  // UV 8-9 - rouge
    "#ff03fb"   // UV 10-11 - violet
  ];