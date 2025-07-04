window.addEventListener('DOMContentLoaded', () => {

    const target = document.getElementById('desktop-tides');
    const wrapper = document.getElementById('tides-container');
    const iframe = document.querySelector('#desktop-tides iframe');

    // Valeur de zoom maximale
    let scale = 1.5;
  
    // Appliquer un zoom dégressif si ça déborde
    function applyAdaptiveZoom() {
        scale = 1.5;
        target.style.transformOrigin = 'top left';
    
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
  
    updateTimeline();
    applyAdaptiveZoom();
    window.addEventListener('resize', () => {
        applyAdaptiveZoom();
        updateTimeline();
    });
});

function updateTimeline() {
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

    const datesWithThreeTides = [
        '2025-06-25',
        '2025-07-04',
        '2025-07-11',
        '2025-07-19',
        '2025-07-25',
        '2025-08-03',
        '2025-08-09',
        '2025-08-17',
        '2025-08-23',
        '2025-09-01',
        '2025-09-08',
        '2025-09-15',
        '2025-09-22',
        '2025-09-30',
        '2025-10-07',
        '2025-10-14',
        '2025-10-22',
        '2025-10-30',
        '2025-11-07',
        '2025-11-13',
        '2025-11-23',
        '2025-11-29'
    ];

    const lastDateStr = datesWithThreeTides[datesWithThreeTides.length - 1];
    const lastDate = new Date(lastDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStr = new Date().toISOString().split('T')[0];
    
    if (today >= lastDate) {
        timeline.style.display = 'none';
    } else {
        if (datesWithThreeTides.includes(todayStr)) {
            timeline.style.top = '255px';
        } else {
            timeline.style.top = '272px';
        }
    }
}