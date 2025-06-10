//Fonctions de coloriage
function getRainColor(rain) {
    let color;
    if (rain > 0) color = `hsl(${Math.round(9 * rain + 180)}, 100%, 50%)`;
    else color = `hsl(0, 0%, 100%)`;
    const textColor = getTextColor(color);
    return { color, textColor };
}
function getColorForTemperature(temp) {
    // Définir les points de transition pour les couleurs
    const colorStops = [
        { temp: -10, color: [16, 52, 166] },    // Bleu foncé
        { temp: 0, color: [15, 157, 232] },    // Bleu clair
        { temp: 20, color: [255, 228, 54] },   // Jaune
        { temp: 40, color: [255, 0, 0] },     // Rouge
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
function getWindColor(wind) {
    let hue = wind > 80 ? 300 : -3.75 * wind + 250;
    hue = (hue + 360) % 360;
    const color = `hsl(${Math.round(hue)}, 100%, 50%)`;
    const textColor = getTextColor(color);
    return { color, textColor };
}
function getTextColor(color) {
    let r, g, b;
    const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hslMatch) {
        const h = parseInt(hslMatch[1], 10);
        const s = parseInt(hslMatch[2], 10);
        const l = parseInt(hslMatch[3], 10);
        const hslToRgb = (h, s, l) => {
            s /= 100;
            l /= 100;
            let r, g, b;
            if (s === 0) {
                r = g = b = l;
            } else {
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;

                const hueToRgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                r = hueToRgb(p, q, h / 360 + 1 / 3);
                g = hueToRgb(p, q, h / 360);
                b = hueToRgb(p, q, h / 360 - 1 / 3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        };
        [r, g, b] = hslToRgb(h, s, l);
    }
    else {
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            r = parseInt(rgbMatch[1], 10);
            g = parseInt(rgbMatch[2], 10);
            b = parseInt(rgbMatch[3], 10);
        } else {
            return 'black';
        }
    }
    // Calcul de la luminosité
    const luminosity = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminosity < 105.4 ? 'white' : 'black';
}
function defaultColorFunc() {
    return {
        color: 'white',
        textColor: 'black'
    };
}