const productBox = document.querySelector('.product__box');
let basketArray = [];
let data = [];

const htmlElProduct = ({ _id, name, image, price, description }) => {
    return `
    <div class="product">
        <div class="pruduct__content">
            <div class="image" >
                <div class="add-to-card d-none">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <span class="add-to-card_text" >Add to card</span>
                </div>
                <img class="product_img" data-product="${_id}" src="${image}" alt="${name}">
            </div>
            <div class="product__desc">
                <h2 class="product__name">${name}</h2>
                <p class="product__description">${description}</p>
                <p class="product__price_label"><span class="product__price">$${price}</span></p>
            </div>
        </div>
    </div>`
};

const htmlBasket = ({ _id, name, image, price, color, size, quantity }) => {
    return `
    <div class="basket_product">
            <button class="basket_btn__del" data-product="${_id}" type="button">удалить</button>
            <div class="basket_product__content">
                <img class="basket_product__img" src="${image}" alt="${name}">
                <div class="basket_product__desc">
                    <h2 class="basket_product__name">${name}</h2>
                    <p class="basket_product__price_label">Price: <span class="product__price">$${price}</span></p>
                    <p class="basket_product__color">Color: ${color}</p>
                    <p class="basket_product__size">Size: ${size}</p>
                    <div class="basket_product__qty">
                        <label class="basket_input__label">Quantity:</label>
                        <input class="basket_input__quantity" type="text" value="${quantity}">
                    </div>
                </div>
            </div>
        </div>`
};


(async () => {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error('Failed from data.json')
        }

        data = await response.json();

        data.forEach((data) => {
            const productEl = htmlElProduct(data);
            productBox.insertAdjacentHTML('beforeend', productEl);
        });
    } catch (error) {
        console.error(error);
    }
}).apply();

productBox.addEventListener('mouseover', (e) => {
    if (e.target.className === "product_img") {
        const imgEl = e.target;
        imgEl.previousElementSibling.classList.remove('d-none');
    }
});
productBox.addEventListener('mouseout', (e) => {
    if (e.target.className === "product_img") {
        const imgEl = e.target;
        imgEl.previousElementSibling.classList.add('d-none');
    }
});

productBox.addEventListener('click', (e) => {
    if (e.target.className === 'product_img') {
        let haveProductBasket = false
        const findProduct = basketArray.forEach((el) => {
            if (Number(el._id) === Number(e.target.dataset.product)) {
                el.quantity += 1;
                haveProductBasket = true
            }
        });
        if (!haveProductBasket) {
            basketArray.push({ "_id": e.target.dataset.product, "quantity": 1 });
        }

        let cartItemsEl = document.querySelector('.cart-items');
        const basketHeaderEl = document.querySelector('.basket_header');
        if (cartItemsEl) {
            cartItemsEl.remove();
            basketHeaderEl.remove();
        }
        cartItemsEl = document.createElement('div');
        cartItemsEl.className = "cart-items";
        bodyEl = document.querySelector('body');
        bodyEl.insertAdjacentElement('beforeend', cartItemsEl);
        let cartItemsData = data.filter((el) => {
            const find = basketArray.find((b) => {
                return el._id === Number(b._id);
            })
            if (find) {
                el.quantity = find.quantity;
                return el;
            } else {
                return false;
            }
        }
        );
        const basketHeader = '<div class="basket_header">Card Items</div>';
        cartItemsEl.insertAdjacentHTML('beforebegin', basketHeader);
        cartItemsData.forEach((data) => {
            const cardEls = htmlBasket(data);
            cartItemsEl.insertAdjacentHTML('beforeend', cardEls);
        });
        const deleteButtons = document.querySelectorAll('.basket_btn__del');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const product = button.closest('.basket_product');
                product.remove();
                const newCard = cartItemsData.filter((el) => {
                    return Number(el._id) !== Number(e.target.dataset.product);
                });
                cartItemsData = newCard;
                if (cartItemsData.length < 1) {
                    cartItemsEl.remove();
                    const basketHeaderEl = document.querySelector('.basket_header');
                    basketHeaderEl.remove();
                    basketArray = [];
                }
            })
        })
    }
});


