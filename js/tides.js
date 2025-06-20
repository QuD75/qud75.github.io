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
        try {
            const data = await fetchData(tidesApi, 'tides', 360, updateTimeline, {
            'Authorization': `${apiKey}`
            });
            console.log("Données de marées récupérées :", data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données de marées :", error);
            updateTimeline();
        }
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
    window.addEventListener("resize", () => {
        applyAdaptiveZoom();
        updateTimeline();
    });
});

function updateTimeline(data) {
    const timeline = document.getElementById('timeline');
    const now = new Date();

    // minutes depuis minuit
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

    // position entre 55 et 655 px (linéaire)
    const leftMin = 55;
    const leftMax = 655;

    // interpolation linéaire
    const left = leftMin + ((leftMax - leftMin) * minutesSinceMidnight) / (24 * 60);

    // appliquer la position
    timeline.style.left = `${left}px`;

    let hasFourTides = true;
    if (data) {
        hasFourTides = hasFourTidesInParisDay(data);
        if (!hasFourTides) timeline.style.top = "255px";
    }
    return hasFourTides;
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