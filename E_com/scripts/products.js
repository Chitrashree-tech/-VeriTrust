// Mock product data
const products = [
    {
        id: 1,
        name: 'Samsung 55" 4K Smart TV',
        price: 399.99,
        image: 'images/products/tv.jpg',
        category: 'electronics',
        rating: 4.5,
        reviews: 1243
    },
    {
        id: 2,
        name: 'Apple iPhone 15 Pro',
        price: 999.00,
        image: 'images/products/iphone.jpg',
        category: 'electronics',
        rating: 4.8,
        reviews: 892
    },
    // Add more products...
];

// Render products
function renderProducts(filteredProducts = products) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <div class="price">₹${product.price.toFixed(2)}</div>
            <div class="rating">
                ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                ${product.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                <span>(${product.reviews})</span>
            </div>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const product = products.find(p => p.id === productId);
            AppState.addToCart(product);
        });
    });
}

// Filter products
function filterProducts() {
    const priceRange = parseInt(document.getElementById('priceRange').value);
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(checkbox => checkbox.value);
    
    const filtered = products.filter(product => {
        return product.price <= priceRange && 
               selectedCategories.includes(product.category);
    });
    
    renderProducts(filtered);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    
    // Filter event listeners
    document.getElementById('priceRange').addEventListener('input', filterProducts);
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
});
// Updated product card rendering with proper event delegation
function renderProducts(filteredProducts = products) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <div class="price">₹${product.price.toFixed(2)}</div>
            <div class="rating">
                ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                ${product.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                <span>(${product.reviews})</span>
            </div>
            <button class="btn add-to-cart">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Use event delegation for add-to-cart buttons
    productGrid.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.id);
            const product = products.find(p => p.id === productId);
            
            if (product) {
                AppState.addToCart(product);
                
                // Visual feedback
                const btn = e.target;
                btn.innerHTML = '<i class="fas fa-check"></i> Added';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerHTML = 'Add to Cart';
                    btn.disabled = false;
                }, 1500);
            }
        }
    });
}