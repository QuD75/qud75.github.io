const FOOTER_VERSION = "v1"; // 🔁 Incrémente cette version à chaque changement
const footerKey = `cachedFooter_${FOOTER_VERSION}`;

function loadFooter() {
  const footerContainer = document.getElementById("footer-container");
  if (!footerContainer) return;

  const cached = localStorage.getItem(footerKey);
  if (cached) {
    footerContainer.innerHTML = cached;
    updateFooterYear();
    return;
  }

  fetch("/pages/footer.html")
    .then(response => {
      if (!response.ok) throw new Error("Footer not found");
      return response.text();
    })
    .then(html => {
      footerContainer.innerHTML = html;
      updateFooterYear();
      localStorage.setItem(footerKey, html);
    })
    .catch(err => {
      console.error("Erreur de chargement du footer:", err);
    });
}

function updateFooterYear() {
  const yearSpan = document.getElementById("footer-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", loadFooter);