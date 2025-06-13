function updateTimeline() {
    const timeline = document.getElementById('timeline');
    const now = new Date();

    // minutes depuis minuit
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

    // total minutes in a day minus 1 to match 23h59
    const totalMinutes = 24 * 60 - 1; // 1439

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

    const target = document.querySelector(".mobile-tides");
    const wrapper = document.querySelector(".tides-container");
  
    if (!target || !wrapper) return;
  
    // Valeur de zoom maximale
    let scale = 1.5;
  
    // Appliquer un zoom dégressif si ça déborde
    function applyAdaptiveZoom() {
        console.log("Applying adaptive zoom...");
        scale = 1.5;
        target.style.transformOrigin = "top center";
    
        while (scale > 1) {
            console.log(`Trying scale: ${scale}`);
            target.style.transform = `scale(${scale})`;
    
            // attendre que le layout s'actualise
            const targetRect = target.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
    
            if (targetRect.width <= wrapperRect.width) {
                console.log("Zoom is acceptable, breaking loop.");
                break; // le zoom est acceptable
            }
    
            scale -= 0.05; // réduire progressivement
            console.log(`Reducing scale to: ${scale}`);
        }
    }
  
    applyAdaptiveZoom();
    window.addEventListener("resize", applyAdaptiveZoom);
});