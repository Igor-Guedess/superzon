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
                    newProduct.innerHTML = `
                        <div class="de__pcard text-center${!product.inStock ? ' out-of-stock' : ''}">
                                <div class="atr__images">
                                    ${
                                        !product.inStock
                                            ? `<div class="atr__promo bg-danger text-white">Esgotado</div>`
                                            : (product.inPromo ? `<div class="atr__promo">Limitado</div>` : ``)
                                    }
                                <a href="${product.src}">
                                    <img class="atr__image-main" src="${product.images[0]}">
                                    ${product.colorOptions && product.images.length > 1 ? `<img class="atr__image-hover" src="${product.images[product.images.length - 1]}">` : ''}
                                </a>
                                <div class="atr__extra-menu">
                                    <a class="atr__quick-view" href="${product.src}"><i class="icon_zoom-in_alt"></i></a>
                                </div>
                            </div>
                            <h3>${product.name}</h3>
                            <div class="atr__colors">${colorButtons}</div>
                            <a class="btn-main fx-slide wow fadeInUp${!product.inStock ? ' disabled' : ''}" 
                            href="${product.src}"
                            ${!product.inStock ? 'style="pointer-events:none;opacity:0.5;background:#ccc;border-color:#ccc;color:#fff;" tabindex="-1"' : ''}><span>Comprar Agora</span></a>
                        </div>
                    `;
                    listProductHTML.appendChild(newProduct);
                });
            }
        }


        $('.fx-slide').each(function() {
            var text = jQuery(this).text();
            jQuery(this).attr('data-hover',text);
        });
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

    document.querySelectorAll('.item_filter_group input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', applyFilters);
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
                applyFilters(); // Aplica o filtro inicial ao carregar
            });
    }

    initApp();
});