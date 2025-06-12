function updateTimeline() {
    console.log("updateTimeline called");
    const maregrammeRoot = document.getElementById("maregramme-root");
    
    if (maregrammeRoot) {
        console.log("maregrammeRoot", maregrammeRoot.innerHTML);
    } else {
        console.warn("Element with id 'maregramme-root' not found");
    }
}

// Observer les changements dans le DOM
const observer = new MutationObserver((mutationsList, observerInstance) => {
    const target = document.getElementById("maregramme-root");
    if (target) {
        console.log("Élément détecté !");
        updateTimeline();
        observerInstance.disconnect(); // Arrêter l'observation une fois l'élément trouvé
    }
});

// Démarrer l'observation à partir de <body>
observer.observe(document.body, {
    childList: true,
    subtree: true, // Pour surveiller tous les niveaux
});