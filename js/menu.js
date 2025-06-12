const menuKey = "cachedMenu";
const container = document.getElementById("menu-container");

if (sessionStorage.getItem(menuKey)) {
    container.innerHTML = sessionStorage.getItem(menuKey);
} else {
    const html = `
        <nav class="site-nav">
            <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">&#9776;</button>
            <ul class="nav-links" id="main-nav">
                <li><a href="/pages/previsions-meteo.html">Prévisions météo</a></li>
                <li><a href="/pages/marees.html">Infos marées</a></li>
                <li><a href="/pages/station-meteo.html">Station météo</a></li>
                <li><a href="/pages/webcam.html">Webcam</a></li>
                <li><a href="/pages/climat-croisic.html">Climat Croisic</a></li>
            </ul>
        </nav>
    `;
    container.innerHTML = html;
    sessionStorage.setItem(menuKey, html);
}

// Toujours exécuter après le DOM update
// Utilise setTimeout pour attendre l'injection HTML dans le DOM actuel
setTimeout(() => {
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen);
        });
    }
}, 0);