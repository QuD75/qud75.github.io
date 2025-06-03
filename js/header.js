const headerKey = "cachedHeader";
const cached = localStorage.getItem(headerKey);

if (cached) {
    document.getElementById("header-container").innerHTML = cached;
} else {
    const html = `
        <header class="site-header">
            <div class="logo-title">
                <img src="/icons/logos/Le_Croisic_logo.png" alt="Logo gauche" class="logo">
                <a href="/index.html" class="header-link">
                    <h1>Météo au Croisic</h1>
                </a>
                <img src="/icons/logos/Blason_Le_Croisic.png" alt="Logo droite" class="logo">
            </div>
        </header>
    `;
    document.getElementById("header-container").innerHTML = html;
    localStorage.setItem(headerKey, html);
}