document.addEventListener('DOMContentLoaded', function () {
    const listProductHTML = document.querySelector('.list-product');
    let listProducts = [];
    let baseFilter = null; // Filtro inicial baseado na página

    // --- Identifica a página atual para definir o filtro base ---
    const pageName = window.location.pathname.split("/").pop();
    if (pageName === 'purificadores.html') {
        baseFilter = 'purificadores';
    } else if (pageName === 'refis.html') {
        baseFilter = 'refil';
    } else if (pageName === 'bebedouros.html') {
        baseFilter = 'bebedouro';
    }

    function getSelectedCategories() {
        return Array.from(document.querySelectorAll('.item_filter_group input[type="checkbox"]:checked'))
            .map(cb => cb.value);
    }

    const addDataToHTML = (productsToShow) => {
        const sortedProducts = [...productsToShow].sort((a, b) => {
            return (a.inStock === b.inStock) ? 0 : a.inStock ? -1 : 1;
        });

        if (listProductHTML) {
            listProductHTML.innerHTML = '';
            if (sortedProducts.length > 0) {
                sortedProducts.forEach(product => {
                    // MODIFICAÇÃO INICIA AQUI
                    let finalSrc = product.src; // Usa o src original por padrão
                    const srcTarget = (product.src.includes('wa.me')) ? ' target="_blank"' : '';

                    // Verifica se o link é para o WhatsApp
                    if (product.src.includes('wa.me')) {
                        // Monta a mensagem personalizada
                        const message = `Olá, eu gostaria de adquirir o produto: \n\n${product.name}`;
                        // Codifica a mensagem para ser usada em uma URL
                        const encodedMessage = encodeURIComponent(message);
                        // Cria o novo link completo
                        finalSrc = `${product.src}?text=${encodedMessage}`;
                    }
                    // FIM DA MODIFICAÇÃO

                    let colorButtons = '';
                    if (product.colorOptions && product.colors && product.images) {
                        product.colors.forEach((color, idx) => {
                            colorButtons += `
                                <div class="atr__color${idx === 0 ? ' active' : ''}" 
                                    data-image="${product.images[idx] || product.images[0]}" 
                                    data-bgcolor="${color}">
                                    <span style="background:${color}"></span>
                                </div>
                            `;
                        });
                    }
                    let newProduct = document.createElement('div');
                    newProduct.classList.add('col-xl-3', 'col-lg-4', 'col-md-6');
                    // Substituímos 'product.src' por 'finalSrc' nos links abaixo
                    newProduct.innerHTML = `
                        <div class="de__pcard text-center${!product.inStock ? ' out-of-stock' : ''}">
                            <div class="atr__images">
                                ${
                                    !product.inStock
                                        ? `<div class="atr__promo bg-danger text-white">Esgotado</div>`
                                        : (product.inPromo ? `<div class="atr__promo">Limitado</div>` : ``)
                                }
                                <a href="${finalSrc}"${srcTarget}>
                                    <img class="atr__image-main" src="${product.images[0]}">
                                    ${product.colorOptions && product.images.length > 1 ? `<img class="atr__image-hover" src="${product.images[product.images.length - 1]}">` : ''}
                                </a>
                                <div class="atr__extra-menu">
                                    <a class="atr__quick-view" href="${finalSrc}"${srcTarget}><i class="icon_zoom-in_alt"></i></a>
                                </div>
                            </div>
                            <h3>${product.name}</h3>
                            <div class="atr__colors">${colorButtons}</div>
                            <a class="btn-main fx-slide wow fadeInUp${!product.inStock ? ' disabled' : ''}" 
                            href="${finalSrc}"${srcTarget}
                            ${!product.inStock ? 'style="pointer-events:none;opacity:0.5;background:#ccc;border-color:#ccc;color:#fff;" tabindex="-1"' : ''}><span>Comprar Agora</span></a>
                        </div>
                    `;
                    listProductHTML.appendChild(newProduct);
                });
            }
        }
    }

    function applyFilters() {
        const selected = getSelectedCategories();
        
        let productsToFilter = listProducts;

        if (baseFilter === 'purificadores') {
            productsToFilter = listProducts.filter(prod => 
                prod.categories && !prod.categories.includes('refil') && !prod.categories.includes('bebedouro')
            );
        } else if (baseFilter === 'refil') {
            productsToFilter = listProducts.filter(prod => prod.categories && prod.categories.includes('refil'));
        } else if (baseFilter === 'bebedouro') {
            productsToFilter = listProducts.filter(prod => prod.categories && prod.categories.includes('bebedouro'));
        }

        if (selected.length === 0) {
            addDataToHTML(productsToFilter);
        } else {
            const filtered = productsToFilter.filter(prod =>
                prod.categories && selected.every(cat => prod.categories.includes(cat))
            );
            addDataToHTML(filtered);
        }
    }

    const categoryCheckboxes = document.querySelectorAll('.item_filter_group input[type="checkbox"]');

    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                categoryCheckboxes.forEach(otherCheckbox => {
                    if (otherCheckbox !== this) {
                        otherCheckbox.checked = false;
                    }
                });
            }
            applyFilters();
        });
    });

    if (listProductHTML) {
        listProductHTML.addEventListener('click', function(event) {
            const colorBtn = event.target.closest('.atr__colors > div');
            if (colorBtn) {
                colorBtn.parentElement.querySelectorAll('div').forEach(div => div.classList.remove('active'));
                colorBtn.classList.add('active');
                const imageUrl = colorBtn.getAttribute('data-image');
                const card = colorBtn.closest('.de__pcard');
                if (card) {
                    const img = card.querySelector('.atr__image-main');
                    if (img && imageUrl) img.src = imageUrl;
                }
            }
        });
    }

    const initApp = () => {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                listProducts = data;
                applyFilters();
            });
    }

    initApp();
});