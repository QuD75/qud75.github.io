function updateTimeline() {
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
}
  
window.addEventListener('DOMContentLoaded', () => {
    updateTimeline();

    //const target = document.getElementById("mobile-tides");
    const target = document.getElementById("desktop-tides");
    const wrapper = document.getElementById("tides-container");
    const iframe = document.querySelector('#desktop-tides iframe');

    if (!target || !wrapper  || !iframe) {
        console.error("Tides container or iframe not found, skipping adaptive zoom.");
        return;
    }

    // Valeur de zoom maximale
    let scale = 2;
  
    // Appliquer un zoom dégressif si ça déborde
    function applyAdaptiveZoom() {
        scale = 2;
        target.style.transformOrigin = "top left";
    
        while (scale > 0) {
            console.log(`Trying scale: ${scale}`);
            target.style.transform = `scale(${scale})`;
    
            // attendre que le layout s'actualise
            const rect = iframe.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const targetRect = target.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
    
            //if (targetRect.height <= wrapperRect.height) {
            console.log("rectWidth:", rect.width);
            console.log("viewportWidth:", viewportWidth);
            if (rect.width < viewportWidth) {
                break; // le zoom est acceptable
            }
    
            scale -= 0.05; // réduire progressivement
        }

        console.log(`Applied adaptive zoom: scale = ${scale}`);
    }
  
    applyAdaptiveZoom();
    window.addEventListener("resize", applyAdaptiveZoom);
});