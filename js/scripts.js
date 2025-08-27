// Espera o conteúdo da página carregar
document.addEventListener("DOMContentLoaded", function() {

    // --- CARREGA O FOOTER ---
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            // Insere o HTML do footer dentro da div placeholder
            document.getElementById("footer-placeholder").innerHTML = data;
        });

});