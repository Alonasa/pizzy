let selectedSizeId = '';
let selectedPrice = '';
let selectedCategory = '';
let selectedSize = '';


function updatePrice(categoryID, productId, price, size_id, size, buttonElement) {
    const priceDisplay = document.getElementById(`price-display-${categoryID}-${productId}`);
    // Update displayed price
    priceDisplay.innerHTML = `${price}&#8364;`;
    selectedPrice = price;
    selectedCategory = categoryID;
    selectedSizeId = size_id;
    selectedSize = size;

    // Optional: Highlight selected button
    const buttons = buttonElement.parentElement.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active'); // Highlight the selected button
}


function addToCart(productId, title) {
    const data = {
        title: title,
        category_id: selectedCategory,
        product_id: productId,
        size_id: selectedSizeId,
        size: selectedSize,
        price: selectedPrice,
        quantity: 1,
    };

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
                    duration: 3000,
                    gravity: 'top', // top or bottom
                    position: 'right', // left, center or right
                    backgroundColor: '#ffc107',
                }).showToast();
            } else {
                Toastify({
                    text: 'Error adding product to cart',
                    duration: 3000,
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

export {updatePrice, addToCart};
