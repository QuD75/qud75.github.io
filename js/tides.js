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
});