// Enhanced cart functionality
function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    // Empty cart state
    if (AppState.cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }
    
    cartSummary.style.display = 'block';
    cartItemsContainer.innerHTML = '';
    
    // Render each cart item
    AppState.cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="price">₹${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    updateCartSummary();
    setupCartEventListeners();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    const itemCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelector('.item-count').textContent = itemCount;
    document.querySelector('.subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.querySelector('.tax').textContent = `₹${tax.toFixed(2)}`;
    document.querySelector('.total-price').textContent = `₹${total.toFixed(2)}`;
}

// Setup event listeners for cart interactions
function setupCartEventListeners() {
    // Decrease quantity
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const item = AppState.cart.find(item => item.id === productId);
            
            if (item && item.quantity > 1) {
                AppState.updateQuantity(productId, item.quantity - 1);
                renderCart();
            }
        });
    });
    
    // Increase quantity
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const item = AppState.cart.find(item => item.id === productId);
            
            if (item) {
                AppState.updateQuantity(productId, item.quantity + 1);
                renderCart();
            }
        });
    });
    
    // Remove item
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            AppState.removeFromCart(productId);
            renderCart();
        });
    });
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    
    // Update cart count in header
    AppState.updateCartCount();
});
