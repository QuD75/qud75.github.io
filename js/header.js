const headerKey = "cachedHeader";

if (sessionStorage.getItem(headerKey)) {
  document.getElementById("header-container").innerHTML = sessionStorage.getItem(headerKey);
} else {
  const html = `
    <header class="site-header">
        <div class="logo-title">
            <img src="/icons/logos/Le_Croisic_logo.webp" alt="Logo gauche" class="logo">
            <a href="/index.html" class="header-link">
                <h1>Météo au Croisic</h1>
            </a>
            <img src="/icons/logos/Blason_Le_Croisic.webp" alt="Logo droite" class="logo">
        </div>
    </header>
  `;
  document.getElementById("header-container").innerHTML = html;
  sessionStorage.setItem(headerKey, html);
}