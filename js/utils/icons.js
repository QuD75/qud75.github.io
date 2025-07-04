function getWindDirectionIcon(degrees) {
    const directions = [
      'n', 'nne', 'ne', 'ene', 'e', 'ese', 'se', 'sse',
      's', 'sso', 'so', 'oso', 'o', 'ono', 'no', 'nno'
    ];
  
    // Normaliser l'angle entre 0 et 360
    const angle = ((degrees % 360) + 360) % 360;
  
    // 360° / 16 = 22.5°, on ajoute 11.25 pour centrer
    const index = Math.round(angle / 22.5) % 16;
  
    return `/icons/wind/${directions[index]}.png`;
  }