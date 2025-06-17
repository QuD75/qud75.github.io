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

    const target = document.getElementById("mobile-tides");
    const wrapper = document.getElementById("tides-container");

    if (!target || !wrapper) {
        return;
    }    

    console.log("Tides container found, applying adaptive zoom...");

    // Valeur de zoom maximale
    let scale = 1.5;
  
    // Appliquer un zoom dégressif si ça déborde
    function applyAdaptiveZoom() {
        scale = 1.5;
        target.style.transformOrigin = "top center";
    
        while (scale > 1) {
            target.style.transform = `scale(${scale})`;
    
            // attendre que le layout s'actualise
            const targetRect = target.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
    
            if (targetRect.height <= wrapperRect.height) {
                break; // le zoom est acceptable
            }
    
            scale -= 0.05; // réduire progressivement
        }
    }
  
    applyAdaptiveZoom();
    window.addEventListener("resize", applyAdaptiveZoom);
});