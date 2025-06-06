const menuKey = "cachedMenu";

if (sessionStorage.getItem(menuKey)) {
    document.getElementById("menu-container").innerHTML = sessionStorage.getItem(menuKey);;
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
    sessionStorage.setItem(menuKey, html);
}