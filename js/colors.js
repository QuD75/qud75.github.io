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

function getColorForHumidity(hum){  
    if (hum <= 30) {
      return 'rgb(255, 255, 255)';
    } else {
      const ratio = (hum - 30) / (100 - 30); // de 0 à 1
      const intensity = Math.round(255 * (1 - ratio));
      return `rgb(${intensity}, ${intensity}, ${intensity})`;
    }
}

function getColorForWindSpeed(speed) {
    function hexToRgb(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }
  
    function interpolateColor(color1, color2, t) {
      const r = Math.round(color1[0] + (color2[0] - color1[0]) * t);
      const g = Math.round(color1[1] + (color2[1] - color1[1]) * t);
      const b = Math.round(color1[2] + (color2[2] - color1[2]) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  
    const gradients = [
      { min: 0, max: 20, from: "#D0F0FF", to: "#6FAED9" },  // bleu pastel
      { min: 20, max: 40, from: "#C8FACC", to: "#6FBF73" }, // vert pastel
      { min: 40, max: 60, from: "#FFFACD", to: "#FFD580" }, // jaune → orange pastel
      { min: 60, max: 80, from: "#FFD580", to: "#FF7F7F" }, // orange → rouge pastel
      { min: 80, max: 100, from: "#FF7F7F", to: "#C299FF" } // rouge → violet pastel
    ];
  
    if (speed > 100) {
      return "rgb(194, 153, 255)"; // Violet pastel
    }
  
    for (const grad of gradients) {
      if (speed >= grad.min && speed <= grad.max) {
        const t = (speed - grad.min) / (grad.max - grad.min);
        return interpolateColor(hexToRgb(grad.from), hexToRgb(grad.to), t);
      }
    }
  
    return "rgb(0, 0, 0)"; // défaut
}
  

function getColorForUv(uv){
    // Tableau des couleurs clés du gradient arc-en-ciel (indigo à violet)
    const colors = [
        { r: 0,   g: 255, b: 255 },  // Cyan (4)
        { r: 0,   g: 255, b: 0   },  // Vert (6)
        { r: 255, g: 255, b: 0   },  // Jaune (8)
        { r: 255,   g: 165, b: 0   },  // Orange (6)
        { r: 255, g: 0, b: 0   },  // Rouge (8)
        { r: 148, g: 0,   b: 211 }   // Violet (10)
    ];

    // Les positions correspondantes dans l'index (0-11)
    const positions = [0, 2, 4, 6, 8, 10];

    // Trouver entre quelles couleurs interpoler
    let i = 0;
    while (i < positions.length - 1 && uv > positions[i+1]) {
        i++;
    }

    const startPos = positions[i];
    const endPos = positions[i+1];
    const ratio = (uv - startPos) / (endPos - startPos);

    const startColor = colors[i];
    const endColor = colors[i+1];

    // interpolation linéaire RGB
    const r = Math.round(startColor.r + ratio * (endColor.r - startColor.r));
    const g = Math.round(startColor.g + ratio * (endColor.g - startColor.g));
    const b = Math.round(startColor.b + ratio * (endColor.b - startColor.b));

    return `rgb(${r}, ${g}, ${b})`;
}