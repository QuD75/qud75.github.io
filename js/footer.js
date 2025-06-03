const footerKey = "cachedFooter";

if (sessionStorage.getItem(footerKey)) {
    document.getElementById("footer-container").innerHTML = sessionStorage.getItem(footerKey);
} else {
    const html = `
        <footer class="site-footer">
            <p>&copy; ${new Date().getFullYear()} Météo Croisic - <a href="/pages/mentions-legales.html">Mentions légales</a></p>
        </footer>
    `;
    document.getElementById("footer-container").innerHTML = html;
    sessionStorage.setItem(footerKey, html);
}