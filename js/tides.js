window.addEventListener('DOMContentLoaded', () => {

    async function getApiData() {
        fetchData("https://maree.info/114", 'tides', 60, updateTimeline);
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

    const numberOfTides = getNumberOfTides(data);
    console.log(`Nombre de marées : ${numberOfTides}`);
    if (numberOfTides < 4) {
        timeline.style.top = "255px";
    }
}

function getNumberOfTides(data) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;

    const row = tempDiv.querySelector('#MareeJours_0');
    if (!row) {
      console.warn('Élément #MareeJours_0 non trouvé');
      return 4;
    }

    const tdHours = row.querySelectorAll('td')[0];
    if (!tdHours) {
      console.warn('Pas de cellule d\'heures trouvée');
      return 4;
    }

    const hours = tdHours.innerText.match(/\d{2}h\d{2}/g);
    return hours ? hours.length : 4;
}