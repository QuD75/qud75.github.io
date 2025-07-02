const HEADER_VERSION = "v2";
const headerKey = `cachedHeader_${HEADER_VERSION}`;

function loadHeader() {
  const headerContainer = document.getElementById("header-container");
  if (!headerContainer) return;

  const cached = localStorage.getItem(headerKey);
  if (cached) {
    headerContainer.innerHTML = cached;
    return;
  }

  fetch("/pages/header.html")
    .then(response => {
      if (!response.ok) throw new Error("Header not found");
      return response.text();
    })
    .then(html => {
      headerContainer.innerHTML = html;
      localStorage.setItem(headerKey, html);
      // Nettoyage des anciennes versions
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("cachedHeader_") && key !== headerKey) {
          localStorage.removeItem(key);
        }
      });
    })
    .catch(err => {
      console.error("Erreur de chargement du header:", err);
    });
}

document.addEventListener("DOMContentLoaded", loadHeader);