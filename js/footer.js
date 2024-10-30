// Fonction pour charger le footer
function loadFooter() {
    // Vérifier si le footer est déjà dans le stockage local
    const storedFooter = localStorage.getItem('footerContent');

    if (storedFooter) {
        // Si le footer est trouvé dans le stockage local, l'afficher
        document.getElementById('footer-container').innerHTML = storedFooter;
    } else {
        // Si le footer n'est pas trouvé, le charger depuis le fichier
        fetch('/pages/footer.html')
            .then(response => response.text())
            .then(data => {
                // Stocker le contenu du footer dans le stockage local
                localStorage.setItem('footerContent', data);
                // Afficher le footer
                document.getElementById('footer-container').innerHTML = data;
            })
            .catch(error => console.error('Erreur lors du chargement du footer:', error));
    }
}

// Appeler la fonction pour charger le footer
loadFooter();