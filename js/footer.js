const footerKey = "cachedFooter";
const cached = localStorage.getItem(footerKey);

if (cached) {
    document.getElementById("footer-container").innerHTML = cached;
} else {
    const html = `
        <footer class="site-footer">
            <p>&copy; ${new Date().getFullYear()} Météo Croisic - <a href="/pages/mentions-legales.html">Mentions légales</a></p>
        </footer>
    `;
    document.getElementById("footer-container").innerHTML = html;
    localStorage.setItem(footerKey, html);
}