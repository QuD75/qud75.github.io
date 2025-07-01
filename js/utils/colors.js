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

function getColorForHumidity(hum) {  
    if (hum <= 30) {
      return 'rgb(255, 255, 255)';
    } else {
      const ratio = (hum - 30) / (100 - 30); // de 0 à 1
      const intensity = Math.round(255 * (1 - ratio));
      return `rgb(${intensity}, ${intensity}, ${intensity})`;
    }
}

function getColorForWindSpeed(speed) {
  if (speed <= 12) return '#00FF00';       // vert fluo
  if (speed <= 19) return '#32CD32';       // vert citron plus vif
  if (speed <= 25) return '#FFFF00';       // jaune pur
  if (speed <= 35) return '#FFC300';       // jaune-orange intense
  if (speed <= 45) return '#FF8C00';       // orange vif
  if (speed <= 55) return '#FF5733';       // orange-rouge vif
  if (speed <= 65) return '#FF3300';       // rouge-orangé saturé
  if (speed <= 75) return '#FF0000';       // rouge pur
  if (speed <= 95) return '#CC0000';       // rouge foncé
  if (speed <= 115) return '#990099';      // violet intense
  return '#8B00FF';                        // violet électrique (plus flashy que le précédent)
}

function getColorForUv(uv) {
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

function getColorForRain(rain) {
  // Palette des paliers
  const palette = [
    { rain: 0,  color: [229,251,254] },
    { rain: 1,  color: [0,215,248] },
    { rain: 2,  color: [0,188,255] },
    { rain: 4,  color: [0,131,255]  },
    { rain: 6,  color: [0,19,255]  },
    { rain: 10, color: [138, 43, 226]  }
  ];

  // Si au-delà du max, retourne la dernière couleur
  if (rain >= 10) {
    const c = palette[palette.length - 1].color;
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  }

  // Cherche les 2 paliers autour de la valeur
  for (let i = 0; i < palette.length - 1; i++) {
    const p1 = palette[i];
    const p2 = palette[i + 1];
    if (rain >= p1.rain && rain < p2.rain) {
      const t = (rain - p1.rain) / (p2.rain - p1.rain); // interpolation 0–1
      const r = Math.round(p1.color[0] + t * (p2.color[0] - p1.color[0]));
      const g = Math.round(p1.color[1] + t * (p2.color[1] - p1.color[1]));
      const b = Math.round(p1.color[2] + t * (p2.color[2] - p1.color[2]));
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  // Cas très improbable : fallback au premier
  const c = palette[0].color;
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function getTextColorFromBackground(bgColor) {
    const parts = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!parts) return '#000'; // fallback noir si format inattendu
  
    const r = parseInt(parts[1], 10);
    const g = parseInt(parts[2], 10);
    const b = parseInt(parts[3], 10);
  
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 128 ? '#fff' : '#000';


}