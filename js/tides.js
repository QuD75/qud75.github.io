window.addEventListener('DOMContentLoaded', () => {

    const apiKey = '8b2d7d44-469d-11f0-976d-0242ac130006-8b2d7db2-469d-11f0-976d-0242ac130006';
    const baseUrl = 'https://api.stormglass.io/v2/tide/extremes/point';
    const lat = 47.29;
    const lng = -2.52;
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const todayStr = today.toISOString().slice(0, 10);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    const tidesApi = `${baseUrl}?&lat=${lat}&lng=${lng}&start=${todayStr}&end=${tomorrowStr}`;
    
    async function getApiData() {
/*         const data = await fetchData(tidesApi, 'tides', 360, getWeatherStationData, {
            'Authorization': `${apiKey}`,
          }); */

        const data = '{"data":[{"height":-1.7745836115459195,"time":"2025-06-19T03:41:00+00:00","type":"low"},{"height":1.2283404626757344,"time":"2025-06-19T10:51:00+00:00","type":"high"},{"height":-1.674882424430392,"time":"2025-06-19T16:08:00+00:00","type":"low"},{"height":1.506051572491965,"time":"2025-06-19T23:13:00+00:00","type":"high"}],"meta":{"cost":1,"dailyQuota":10,"datum":"MSL","end":"2025-06-20 00:00","lat":47.29,"lng":-2.52,"offset":0,"requestCount":2,"start":"2025-06-19 00:00","station":{"distance":27,"lat":47.133,"lng":-2.25,"name":"pointe st. gildas","source":"sg"}}}';  
        const parsedData = JSON.parse(data);
        const hasFourTides = hasFourTidesInParisDay(parsedData);
        console.log("Has four tides in Paris day:", hasFourTides);
        updateTimeline(hasFourTides);
    }
  
    getApiData();

    const target = document.getElementById("desktop-tides");
    const wrapper = document.getElementById("tides-container");
    const iframe = document.querySelector('#desktop-tides iframe');

    // Valeur de zoom maximale
    let scale = 1.5;
  
    // Appliquer un zoom dégressif si ça déborde
    function applyAdaptiveZoom() {
        scale = 1.5;
        target.style.transformOrigin = "top left";
    
        while (scale > 0) {
            target.style.transform = `scale(${scale})`;
    
            // attendre que le layout s'actualise
            const rect = iframe.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
    
            if (rect.width <= wrapperRect.width) {
                break; // le zoom est acceptable
            }
    
            scale -= 0.001; // réduire progressivement
        }
    }
  
    applyAdaptiveZoom();
    window.addEventListener("resize", applyAdaptiveZoom);
});

function updateTimeline(hasFourTides) {
    const timeline = document.getElementById('timeline');
    const now = new Date();

    // minutes depuis minuit
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

    // total minutes in a day
    const totalMinutes = 24 * 60;

    // position entre 55 et 655 px (linéaire)
    const leftMin = 55;
    const leftMax = 655;

    // interpolation linéaire
    const left = leftMin + ((leftMax - leftMin) * minutesSinceMidnight) / totalMinutes;

    // appliquer la position
    timeline.style.left = `${left}px`;
    if (!hasFourTides) {
        timeline.style.top = "255px";
    }
}

function hasFourTidesInParisDay(json) {
    // Extraction des données
    const data = json.data;
  
    // On veut comparer la date locale à Paris, donc il faut transformer chaque timestamp UTC en heure Paris
    // et vérifier que la date locale (année-mois-jour) est égale à startDate en heure Paris
  
    // Créons une fonction pour extraire la date locale Paris sous forme "YYYY-MM-DD"
    function toParisDateString(utcDateStr) {
      const date = new Date(utcDateStr);
      // Options pour récupérer date en heure de Paris
      // Paris est "Europe/Paris", la conversion tient compte du DST automatiquement
      return date.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });
    }
  
    // Date de début en string en heure de Paris
    const startParisDateStr = toParisDateString(json.meta.start + "Z");
  
    // On filtre les marées qui ont lieu ce jour en heure Paris
    const tidesInParisDay = data.filter(entry => {
      const parisDate = toParisDateString(entry.time);
      return parisDate === startParisDateStr;
    });
  
    // On renvoie true si au moins 4 marées dans ce jour
    return tidesInParisDay.length >= 4;
}  