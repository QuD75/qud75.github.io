const footerKey = "cachedFooter";
const cachedFooter = localStorage.getItem(footerKey);

if (cachedFooter) {
    document.getElementById("footer-container").innerHTML = cachedFooter;
} else {
    const html = `
        <footer class="site-footer">
            <p>&copy; ${new Date().getFullYear()} Météo Croisic - <a href="/pages/mentions-legales.html">Mentions légales</a></p>
        </footer>
    `;
    document.getElementById("footer-container").innerHTML = html;
    localStorage.setItem(footerKey, html);
}