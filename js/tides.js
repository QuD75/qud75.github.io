window.addEventListener('DOMContentLoaded', () => {
    function updateTimeline() {
        console.log("updateTimeline called");
        const maregrammeRoot = document.getElementById("maregramme-root");

        if (maregrammeRoot) {
            console.log("maregrammeRoot", maregrammeRoot.innerHTML);
        } else {
            console.warn("Element with id 'maregramme-root' not found");
        }
    }

    const tideContainer = document.getElementById("tide-container");

    if (tideContainer) {
        const observer = new MutationObserver((mutationsList, observerInstance) => {
            const target = document.getElementById("maregramme-root");
            if (target) {
                console.log("Élément détecté !");
                updateTimeline();
                observerInstance.disconnect();
            }
        });

        observer.observe(tideContainer, {
            childList: true,
            subtree: true
        });
    } else {
        console.warn("Le conteneur #tide-container est introuvable");
    }
});
