function tryUpdateTimeline() {
    const maregrammeRoot = document.getElementById("maregramme-root");
    if (maregrammeRoot) {
      console.log("maregrammeRoot trouvé !");
      updateTimeline();
    } else {
      console.log("maregrammeRoot pas encore là, je réessaie dans 1s...");
      setTimeout(tryUpdateTimeline, 1000);
    }
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    tryUpdateTimeline();
  });