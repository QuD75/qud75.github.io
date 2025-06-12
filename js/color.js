function getColorForTemperature(temp) {
    // Définir les points de transition pour les couleurs
    const colorStops = [
        { temp: -10, color: [128, 0, 255] },
        { temp: -5, color: [0, 0, 255] },
        { temp: 0, color: [0, 128, 255] },
        { temp: 5, color: [0, 255, 255] },
        { temp: 9, color: [0, 255, 128] },
        { temp: 12, color: [0, 255, 0] },
        { temp: 15, color: [128, 255, 0] },
        { temp: 20, color: [255, 255, 0] },
        { temp: 25, color: [255, 128, 0] },
        { temp: 30, color: [255, 0, 0] },
        { temp: 35, color: [255, 0, 128] },
        { temp: 40, color: [255, 0, 255] },
    ];

    // Trouver les deux points de transition entre lesquels se situe la température
    for (let i = 0; i < colorStops.length - 1; i++) {
        const currentStop = colorStops[i];
        const nextStop = colorStops[i + 1];

        if (temp >= currentStop.temp && temp <= nextStop.temp) {
            // Calculer le ratio de la température entre les deux points
            const ratio = (temp - currentStop.temp) / (nextStop.temp - currentStop.temp);

            // Interpolation linéaire des couleurs
            const r = Math.round(currentStop.color[0] + ratio * (nextStop.color[0] - currentStop.color[0]));
            const g = Math.round(currentStop.color[1] + ratio * (nextStop.color[1] - currentStop.color[1]));
            const b = Math.round(currentStop.color[2] + ratio * (nextStop.color[2] - currentStop.color[2]));

            return `rgb(${r}, ${g}, ${b})`;
        }
        if (temp < colorStops[0].temp) {
            // Si la température est en dessous du premier point, retourner la couleur du premier point
            return `rgb(${colorStops[0].color.join(', ')})`;
        }
        if (temp > colorStops[colorStops.length - 1].temp) {
            // Si la température est au-dessus du dernier point, retourner la couleur du dernier point
            return `rgb(${colorStops[colorStops.length - 1].color.join(', ')})`;
        }
    }

    // Retourner la couleur du dernier point si la température est au-delà de la plage définie
    return `rgb(${colorStops[colorStops.length - 1].color.join(', ')})`;
}