const menuKey = "cachedMenu";

if (sessionStorage.getItem(menuKey)) {
    document.getElementById("menu-container").innerHTML = sessionStorage.getItem(menuKey);;
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
    document.getElementById("menu-container").innerHTML = html;
    sessionStorage.setItem(menuKey, html);
}

const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});