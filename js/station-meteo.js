const url = "https://api.weather.com/v2/pws/observations/current?stationId=ILECRO29&format=json&units=m&apiKey=556a0b6740e249fdaa0b6740e2c9fdea&numericPrecision=decimal";

fetch(url)
    .then(response => response.json())
    .then(data => {
        const obs = data.observations[0];
        document.getElementById("temperature").textContent = `Température : ${obs.metric.temp} °C`;
        document.getElementById("pression").textContent = `Pression : ${obs.metric.pressure} hPa`;
        document.getElementById("humidite").textContent = `Humidité : ${obs.humidity} %`;
        document.getElementById("vent").textContent = `Vent : ${obs.metric.windSpeed} km/h`;
        document.getElementById("lumiere").textContent = `Lumière : ${obs.solarRadiation} W/m²`;
        document.getElementById("pluie").textContent = `Pluie : ${obs.metric.precipTotal} mm`;
    })
    .catch(error => {
        console.error("Erreur de récupération des données météo :", error);
    });
