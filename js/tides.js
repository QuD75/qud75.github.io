function updateTimeline() {
    console.log("updateTimeline called");
    const maregrammeRoot = document.getElementById("maregramme-root");
    
    if (maregrammeRoot) {
        console.log("maregrammeRoot", maregrammeRoot.innerHTML);
    } else {
        console.warn("Element with id 'maregramme-root' not found");
    }
}