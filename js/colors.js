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
  if (speed <= 12) return '#adebad';       // vert très clair
  if (speed <= 19) return '#90ee90';       // vert clair
  if (speed <= 25) return '#ffff99';       // jaune pâle (commence à 20 km/h)
  if (speed <= 35) return '#ffd580';       // jaune/orangé clair
  if (speed <= 45) return '#ffb347';       // orange clair
  if (speed <= 55) return '#ff7f50';       // corail
  if (speed <= 65) return '#ff6347';       // tomate
  if (speed <= 75) return '#ff4500';       // orange rouge vif
  if (speed <= 95) return '#ff0000';       // rouge vif
  if (speed <= 115) return '#b22222';      // bordeaux
  return '#800080';                        // violet foncé
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

function getColorForRain(prob) {
  if (prob === 0) return 'rgba(135, 206, 250, 0.1)';  // très clair (presque transparent)
  if (prob <= 10) return 'rgba(135, 206, 250, 0.2)';
  if (prob <= 20) return 'rgba(135, 206, 250, 0.3)';
  if (prob <= 30) return 'rgba(100, 149, 237, 0.4)';  // bleu cornflower clair
  if (prob <= 40) return 'rgba(70, 130, 180, 0.5)';   // steelblue moyen
  if (prob <= 50) return 'rgba(30, 144, 255, 0.6)';   // dodgerblue
  if (prob <= 60) return 'rgba(25, 25, 112, 0.7)';    // midnightblue semi-transparent
  if (prob <= 70) return 'rgba(0, 0, 205, 0.8)';      // mediumblue
  if (prob <= 80) return 'rgba(0, 0, 139, 0.9)';      // darkblue
  if (prob <= 90) return 'rgba(0, 0, 100, 0.95)';     // très foncé
  return 'rgba(25, 25, 112, 1)';                      // bleu très foncé opaque
}

function getTextColorFromBackground(bgColor) {
    // Extraire les composants R, G, B depuis un hexadécimal (ex: "#ff0000")
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);
  
    // Calculer la luminance perçue (formule YIQ)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
    // Si la luminance est faible, texte en blanc, sinon en noir
    return yiq < 200 ? '#fff' : '#000';
}