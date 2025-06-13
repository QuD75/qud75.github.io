const menuKey = "cachedMenu";
const container = document.getElementById("menu-container");

const menuHTML = `
    <nav class="site-nav">
        <input type="checkbox" id="toggle">
        <label for="toggle">☰</label>
        <ul class="nav-links" id="main-nav">
            <li><a href="/pages/previsions-meteo.html">Prévisions météo</a></li>
            <li><a href="/pages/marees.html">Infos marées</a></li>
            <li><a href="/pages/station-meteo.html">Station météo</a></li>
            <li><a href="/pages/webcam.html">Webcam</a></li>
            <li><a href="/pages/climat-croisic.html">Climat Croisic</a></li>
        </ul>
    </nav>
`;

if (sessionStorage.getItem(menuKey) && false) {
    container.innerHTML = sessionStorage.getItem(menuKey);
} else {
    container.innerHTML = menuHTML;
    sessionStorage.setItem(menuKey, menuHTML);
}

// Initialiser les événements APRÈS l'injection du HTML
setTimeout(() => {
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = navLinks.querySelectorAll('a');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen);
        });

        // Fermer le menu quand un lien est cliqué
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                toggle.setAttribute('aria-expanded', false);
            });
        });
    }
}, 0);