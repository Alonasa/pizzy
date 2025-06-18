import showPopup from "./popup.js";

let selectedPrice = "";
let selectedSize = "";
let selectedSizeId = "";

function updatePrice(categoryID, productId, price, weight, size_id, size, buttonElement) {
    const priceDisplay = document.getElementById(`price-display-${categoryID}-${productId}`);
    const weightDisplay = document.getElementById(`weight-display-${categoryID}-${productId}`);
    // Update displayed price
    priceDisplay.innerText = `${price} €`;
    weightDisplay.innerText = `${weight} g`;

    selectedPrice = price;
    selectedSize = size;
    selectedSizeId = size_id;

    // Optional: Highlight selected button
    const buttons = buttonElement.parentElement.querySelectorAll("button");
    buttons.forEach(btn => btn.classList.remove("active"));
    buttonElement.classList.add("active"); // Highlight the selected button
}

function getCurrentPrice() {
    return selectedPrice;
}

function getCurrentSize() {
    if (!selectedSize) {
        return "";
    }
    return [selectedSizeId, selectedSize];
}

function setToNull() {
    selectedPrice = "";
    selectedSize = "";
    selectedSizeId = "";
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
    setToNull();

    fetch("/add-item", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (response.ok) {
                showPopup("Product added to cart!", "info");
            } else {
                showPopup("Error adding product to cart", "error");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}


function removeFromCart(productId, categoryId, element) {
    fetch("/remove-item", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({product_id: productId, category_id: categoryId}) // Send both IDs
    })
        .then(response => {
            if (!response.ok) {
                showPopup("Error removing product from cart", "error");
            }
            return response.text();
        })
        .then(message => {
            removeItemFromCart(element);
            showPopup(message, "info");

            const itemRow = document.querySelector(`[data-product-id='${productId}'][data-category-id='${categoryId}']`).closest(".row.border-top.border-bottom");
            if (itemRow) {
                itemRow.remove();
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

//Update cart after removing item specially price and amt of items
function updateCartData() {
    const productsPrices = Array.from(document.querySelectorAll(".cart-item .product-price"));
    const pricesPlaceholder = document.querySelector(".total-price");
    const itemsPlaceholder = document.querySelector(".total-items");
    const checkoutButton = document.querySelector(".btn-checkout");

    let cartTotalSum = productsPrices.reduce((acc, price) => {
        acc += Number(price.innerText);
        return acc;
    }, 0).toFixed(2);

    pricesPlaceholder.innerText = cartTotalSum;
    itemsPlaceholder.innerText = productsPrices.length.toString();

    if (productsPrices.length === 0) {
        showPopup("Your cart is empty", "error", "center");
        checkoutButton.disabled = true;
    }
}

//Remove item from cart by class
function removeItemFromCart(element) {
    const itemRow = element.closest(".cart-item");
    if (itemRow) {
        itemRow.remove();
        updateCartData();
    }
}

export {updatePrice, addToCart, getCurrentPrice, getCurrentSize, removeFromCart};
