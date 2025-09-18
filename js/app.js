let listProductHTML = document.querySelector('.list-product');

let listProducts = [];

function getSelectedCategories() {
    return Array.from(document.querySelectorAll('.item_filter_group input[type="checkbox"]:checked'))
        .map(cb => cb.value);
}

const addDataToHTML = (filteredProducts = null) => {
    const productsToShow = filteredProducts || listProducts;
    const sortedProducts = [...productsToShow].sort((a, b) => {
        return (a.inStock === b.inStock) ? 0 : a.inStock ? -1 : 1;
    });

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
                        <a href="shop-product-single.html">
                            <img class="atr__image-main" src="${product.images[0]}">
                            ${product.colorOptions && product.images.length > 1 ? `<img class="atr__image-hover" src="${product.images[product.images.length - 1]}">` : ''}
                        </a>
                        <div class="atr__extra-menu">
                            <a class="atr__quick-view" href="shop-product-single.html"><i class="icon_zoom-in_alt"></i></a>
                        </div>
                    </div>
                    <h3>${product.name}</h3>
                    <div class="atr__colors">${colorButtons}</div>
                    <a class="btn-main fx-slide wow fadeInUp${!product.inStock ? ' disabled' : ''}" 
                    href="shop-product-single.html"
                    ${!product.inStock ? 'style="pointer-events:none;opacity:0.5;background:#ccc;border-color:#ccc;color:#fff;" tabindex="-1"' : ''}><span>Comprar Agora</span></a>
                </div>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }

    $('.fx-slide').each(function() {
        var text = jQuery(this).text();
        jQuery(this).attr('data-hover',text);
    });
}

document.querySelectorAll('.item_filter_group input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
        const selected = getSelectedCategories();
        if (selected.length === 0) {
            addDataToHTML(); // mostra todos
        } else {
            const filtered = listProducts.filter(prod =>
                prod.categories && selected.every(cat => prod.categories.includes(cat))
            );
            addDataToHTML(filtered);
        }
    });
});

listProductHTML.addEventListener('click', function(event) {
    // Add to cart
    if (event.target.closest('.atr__add-cart')) {
        // Lógica de carrinho
        alert('Produto adicionado ao carrinho!');
    }
    // Wishlist
    if (event.target.closest('.atr__wish-list')) {
        alert('Produto adicionado à wishlist!');
    }
    // Troca de cor
    const colorBtn = event.target.closest('.atr__colors > div');
    if (colorBtn) {
        // Remove 'active' de todos os irmãos
        colorBtn.parentElement.querySelectorAll('div').forEach(div => div.classList.remove('active'));
        colorBtn.classList.add('active');
        // Troca a imagem principal
        const imageUrl = colorBtn.getAttribute('data-image');
        const card = colorBtn.closest('.de__pcard');
        if (card) {
            const img = card.querySelector('.atr__image-main');
            if (img && imageUrl) img.src = imageUrl;
        }
    }
});


const initApp = () => {
    //get data from json
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            listProducts = data;
            addDataToHTML();
        })
}

initApp();
