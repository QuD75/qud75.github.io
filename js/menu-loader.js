const MENU_VERSION = "v1";
const menuKey = `cachedMenu_${MENU_VERSION}`;

function loadMenu() {
  const menuContainer = document.getElementById("menu-container");
  if (!menuContainer) return;

  const cached = localStorage.getItem(menuKey);
  if (cached) {
    menuContainer.innerHTML = cached;
    return;
  }

  fetch("/pages/menu.html")
    .then(response => {
      if (!response.ok) throw new Error("Menu not found");
      return response.text();
    })
    .then(html => {
      menuContainer.innerHTML = html;
      localStorage.setItem(menuKey, html);
      // Nettoyage des anciennes versions
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("cachedMenu_") && key !== menuKey) {
          localStorage.removeItem(key);
        }
      });
    })
    .catch(err => {
      console.error("Erreur de chargement du menu:", err);
    });
}

document.addEventListener("DOMContentLoaded", loadMenu);