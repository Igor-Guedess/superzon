document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o botão "Comprar Agora" pelo seu ID
    const purchaseButton = document.getElementById('purchase');

    if (purchaseButton) {
        purchaseButton.addEventListener('click', function(event) {
            // Previne o comportamento padrão do link (que é ir para #)
            event.preventDefault();

            // --- Coleta as informações do produto da página ---

            // Pega o nome do produto do elemento <h2>
            const productName = document.querySelector('.col-md-6 h2').textContent.trim();

            const yourWhatsAppNumber = '557182822102'; 

            let message = `Olá! Gostaria de adquirir o produto: \n\n${productName}.`;

            const encodedMessage = encodeURIComponent(message);

            const whatsappURL = `https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`;

            window.open(whatsappURL, '_blank');
        });
    }
});