// Render order summary
function renderOrderSummary() {
    const orderItemsContainer = document.querySelector('.order-items');
    orderItemsContainer.innerHTML = '';
    
    AppState.cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <div class="price">₹${item.price.toFixed(2)} × ${item.quantity}</div>
            </div>
        `;
        orderItemsContainer.appendChild(orderItem);
    });
    
    // Update totals
    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    document.querySelector('.subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.querySelector('.tax').textContent = `₹${tax.toFixed(2)}`;
    document.querySelector('.total-price').textContent = `₹${total.toFixed(2)}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderOrderSummary();
    
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Form submission
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real app, you would process the payment here
        // For demo, we'll just proceed to confirmation
        window.location.href = 'order-confirmation.html';
    });
    
    // Update cart count in header
    AppState.updateCartCount();
});