// Application state with enhanced cart functionality
const AppState = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    userProfile: JSON.parse(localStorage.getItem('userProfile')) || {
        typicalCartValue: 5000,
        typicalLocation: 'Mumbai',
        devices: ['device123'],
        paymentMethods: ['card789']
    },
    
    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
        return this;
    },
    
    // Update cart count in UI
    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
        return this;
    },
    
    // Add product to cart
    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showNotification(`Added ${product.name} to cart`);
        return this;
    },
    
    // Remove product from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        return this;
    },
    
    // Update product quantity
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
        }
        return this;
    },
    
    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        return this;
    },
    
    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    },
    
    // Initialize
    init() {
        this.updateCartCount();
        
        // Mobile menu toggle
        document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.toggle('active');
        });
        
        return this;
    }
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    AppState.init();
});