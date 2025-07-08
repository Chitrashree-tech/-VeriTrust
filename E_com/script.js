const products = [
{
name: "Smartphone",
price: 15999,
image: "https://images.unsplash.com/photo-1580910051073-1d31cf09d3e4?auto=format&fit=crop&w=400&q=80"
},
{
name: "Headphones",
price: 2999,
image: "https://images.unsplash.com/photo-1581276879432-15a43b4b4f9b?auto=format&fit=crop&w=400&q=80"
},
{
name: "Laptop",
price: 50999,
image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
},
{
name: "Shoes",
price: 1999,
image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80"
}
];

const cart = [];
const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

products.forEach((product, index) => {
const div = document.createElement("div");
div.classList.add("product-card");
div.innerHTML = <img src="${product.image}" alt="${product.name}" /> <h4>${product.name}</h4> <p>₹${product.price}</p> <button onclick="addToCart(${index})">Add to Cart</button> ;
productList.appendChild(div);
});

function addToCart(index) {
cart.push(products[index]);
cartCount.textContent = cart.length;
}

document.getElementById("cart-btn").addEventListener("click", () => {
cartModal.style.display = "block";
cartItems.innerHTML = "";
let total = 0;
cart.forEach(item => {
const li = document.createElement("li");
li.textContent = ${item.name} - ₹${item.price};
cartItems.appendChild(li);
total += item.price;
});
cartTotal.textContent = total;
});

function closeCart() {
cartModal.style.display = "none";
}