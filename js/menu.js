const headerKey = "cachedMenu";
const cached = localStorage.getItem(headerKey);

if (cached) {
    document.getElementById("menu-container").innerHTML = cached;
} else {
    const html = `
        <nav class="site-nav">
            <ul class="nav-links">
                <li><a href="/pages/previsions-meteo.html">Prévisions météo</a></li>
                <li><a href="/pages/marees.html">Infos marées</a></li>
                <li><a href="/pages/station-meteo.html">Station météo</a></li>
                <li><a href="/pages/webcam.html">Webcam</a></li>
                <li><a href="/pages/climat-croisic.html">Climat Croisic</a></li>
            </ul>
        </nav>
    `;
    document.getElementById("menu-container").innerHTML = html;
    localStorage.setItem(headerKey, html);
}