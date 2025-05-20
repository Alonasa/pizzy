export default function updatePrice(categoryID, productId, price, buttonElement) {
    const priceDisplay = document.getElementById(`price-display-${categoryID}-${productId}`);
    priceDisplay.innerHTML = `${price}&#8364;`; // Update displayed price

    // Optional: Highlight selected button
    const buttons = buttonElement.parentElement.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active'); // Highlight the selected button
}


