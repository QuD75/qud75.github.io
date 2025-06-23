function getColorForTemperature(temp) {
  const stops = [
    { temp: -10, color: [0, 32, 96] },
    { temp: 0, color: [0, 128, 255] },
    { temp: 10, color: [0, 204, 204] },
    { temp: 20, color: [255, 255, 102] },
    { temp: 30, color: [255, 165, 0] },
    { temp: 40, color: [204, 0, 0] },
  ];

  if (temp <= stops[0].temp) return `rgb(${stops[0].color.join(',')})`;
  if (temp >= stops[stops.length - 1].temp) return `rgb(${stops[stops.length - 1].color.join(',')})`;

  for (let i = 0; i < stops.length - 1; i++) {
    const curr = stops[i];
    const next = stops[i + 1];
    if (temp >= curr.temp && temp <= next.temp) {
      const ratio = (temp - curr.temp) / (next.temp - curr.temp);
      const r = Math.round(curr.color[0] + ratio * (next.color[0] - curr.color[0]));
      const g = Math.round(curr.color[1] + ratio * (next.color[1] - curr.color[1]));
      const b = Math.round(curr.color[2] + ratio * (next.color[2] - curr.color[2]));
      return `rgb(${r},${g},${b})`;
    }
  }
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
  if (speed <= 5) return '#ffffcc';       // jaune très clair
  if (speed <= 10) return '#ffeda0';      // jaune clair
  if (speed <= 15) return '#fed976';      // jaune doré
  if (speed <= 20) return '#feb24c';      // orange clair
  if (speed <= 30) return '#fd8d3c';      // orange
  if (speed <= 40) return '#fc4e2a';      // rouge clair
  if (speed <= 50) return '#e31a1c';      // rouge vif
  if (speed <= 60) return '#bd0026';      // rouge foncé
  if (speed <= 80) return '#800026';      // bordeaux très foncé
  if (speed <= 100) return '#4b000f';     // bordeaux presque noir
  return '#2b0007';                       // presque noir
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