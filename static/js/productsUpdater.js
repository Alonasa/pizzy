let selectedPrice = '';
let selectedSize = '';
let selectedSizeId = '';

function updatePrice(categoryID, productId, price, weight, size_id, size, buttonElement) {
    const priceDisplay = document.getElementById(`price-display-${categoryID}-${productId}`);
    const weightDisplay = document.getElementById(`weight-display-${categoryID}-${productId}`);
    // Update displayed price
    priceDisplay.innerHTML = `${price} &#8364;`;
    weightDisplay.innerHTML = `${weight} g`;

    selectedPrice = price;
    selectedSize = size;
    selectedSizeId = size_id;

    // Optional: Highlight selected button
    const buttons = buttonElement.parentElement.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active'); // Highlight the selected button
}

function getCurrentPrice() {
    return selectedPrice;
}

function getCurrentSize() {
    if (!selectedSize) {
        return '';
    }
    return [selectedSizeId, selectedSize];
}

function setToNull(){
    selectedPrice = '';
    selectedSize = '';
    selectedSizeId = '';
}

function addToCart(categoryId, productId, title, pictureUrl, priceDefault, sizeIdDefault, sizeDefault, price, size) {
    const data = {
        title: title,
        image: pictureUrl,
        category_id: categoryId,
        product_id: productId,
        sizeId: size ? size[0] : sizeIdDefault,
        size: size ? size[1] : sizeDefault,
        price: price ? price : priceDefault,
        quantity: 1,
    };

    // clean last selected item
    setToNull()

    fetch('/add-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (response.ok) {
                //Toastify popup
                Toastify({
                    text: `Product ${title} added to cart!`,
                    duration: 1000,
                    gravity: 'top', // top or bottom
                    position: 'right', // left, center or right
                    backgroundColor: '#ffc107',
                }).showToast();
            } else {
                Toastify({
                    text: 'Error adding product to cart',
                    duration: 2000,
                    gravity: 'top',
                    position: 'right',
                    backgroundColor: '#ad1840',
                }).showToast();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export {updatePrice, addToCart, getCurrentPrice, getCurrentSize};
