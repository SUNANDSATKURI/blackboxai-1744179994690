// Enhanced Product Data with categories
const products = [
    {
        id: 1,
        name: 'Premium Cotton T-Shirt',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Soft cotton t-shirt for everyday comfort',
        category: 'men',
        colors: ['White', 'Black', 'Navy'],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 2,
        name: 'Slim Fit Jeans',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Classic jeans with modern fit',
        category: 'men',
        colors: ['Blue', 'Black'],
        sizes: ['28', '30', '32', '34']
    },
    {
        id: 3,
        name: 'Summer Floral Dress',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Lightweight dress perfect for warm days',
        category: 'women',
        colors: ['Pink', 'Blue', 'Yellow'],
        sizes: ['XS', 'S', 'M', 'L']
    },
    {
        id: 4,
        name: 'Leather Crossbody Bag',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Stylish and practical everyday bag',
        category: 'accessories',
        colors: ['Brown', 'Black'],
        sizes: ['One Size']
    },
    {
        id: 5,
        name: 'Classic Wool Coat',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Warm and elegant winter coat',
        category: 'women',
        colors: ['Beige', 'Gray', 'Black'],
        sizes: ['S', 'M', 'L']
    },
    {
        id: 6,
        name: 'Casual Sneakers',
        price: 69.99,
        image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Comfortable sneakers for everyday wear',
        category: 'men',
        colors: ['White', 'Black'],
        sizes: ['US 8', 'US 9', 'US 10', 'US 11']
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsContainer = document.getElementById('products');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const categoryBtns = document.querySelectorAll('.category-btn');

// Display products with category filtering
function displayProducts(category = 'all') {
    productsContainer.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden transition duration-300';
        productCard.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
                <span class="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                    ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
            </div>
            <div class="p-4">
                <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${product.colors.map(color => 
                        `<span class="text-xs px-2 py-1 bg-gray-100 rounded">${color}</span>`
                    ).join('')}
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition" 
                            data-id="${product.id}">
                        <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });

    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Update cart count and save to localStorage
function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show cart notification
function showCartNotification() {
    cartCount.classList.add('animate-bounce');
    setTimeout(() => {
        cartCount.classList.remove('animate-bounce');
    }, 1000);
}

// Display cart items
function displayCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'flex justify-between items-start border-b pb-4';
        cartItem.innerHTML = `
            <div class="flex items-start space-x-4">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                <div>
                    <h4 class="font-medium">${item.name}</h4>
                    <p class="text-gray-500 text-sm">$${item.price.toFixed(2)}</p>
                    <div class="flex items-center space-x-2 mt-2">
                        <button class="decrease-quantity text-gray-500 hover:text-indigo-600" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="w-8 text-center">${item.quantity}</span>
                        <button class="increase-quantity text-gray-500 hover:text-indigo-600" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-end">
                <span class="font-medium">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item text-red-500 hover:text-red-700 mt-2" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
        
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Cart quantity functions
function increaseQuantity(e) {
    const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
    displayCartItems();
}

function decreaseQuantity(e) {
    const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
    displayCartItems();
}

function removeItem(e) {
    const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    displayCartItems();
}

// Checkout function
function checkout() {
    if (cart.length === 0) return;
    
    alert('Thank you for your purchase! Your order has been placed.');
    cart = [];
    updateCart();
    displayCartItems();
    cartModal.classList.add('hidden');
}

// Category filter functionality
categoryBtns.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Filter products
        displayProducts(button.dataset.category);
    });
});

// Event listeners
cartBtn.addEventListener('click', () => {
    displayCartItems();
    cartModal.classList.remove('hidden');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

checkoutBtn.addEventListener('click', checkout);

// Close modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.add('hidden');
    }
});

// Initialize
displayProducts();
updateCart();

// Set 'All' category as active by default
document.querySelector('[data-category="all"]').classList.add('active');
