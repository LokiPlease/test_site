document.addEventListener('DOMContentLoaded', async () => {
    console.log("Loading products");
    const productsDiv = document.getElementById('products');
    const messageDiv = document.getElementById('message');
    const createMessageDiv = document.getElementById('createMessage');
    
    const loadProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/products');
            console.log("Products response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const products = await response.json();
            productsDiv.innerHTML = '';
            if (products.length === 0) {
                productsDiv.innerHTML = '<p class="text-gray-600">No products available.</p>';
                return;
            }
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'bg-white p-4 rounded-lg shadow-lg';
                productCard.innerHTML = `
                    <h5 class="text-lg font-semibold">${product.name}</h5>
                    <p class="text-gray-600">${product.description}</p>
                    <p class="text-gray-800 font-bold">$${product.price}</p>
                    <button class="btn-primary text-white px-4 py-2 rounded-md mt-2 add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                        <svg class="h-5 w-5 inline-block mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                    </button>
                `;
                productsDiv.appendChild(productCard);
            });

            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', () => {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        messageDiv.innerText = 'Please login to add to cart!';
                        messageDiv.className = 'message-error';
                        return;
                    }
                    const cartItem = {
                        id: button.dataset.id,
                        name: button.dataset.name,
                        price: button.dataset.price
                    };
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart.push(cartItem);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    messageDiv.innerText = 'Added to cart!';
                    messageDiv.className = 'message-success';
                });
            });
        } catch (error) {
            console.error("Products loading error:", error);
            messageDiv.innerText = 'Failed to load products. Please try again later.';
            messageDiv.className = 'message-error';
        }
    };

    await loadProducts();

    document.getElementById('createProductForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            createMessageDiv.innerText = 'Please login to create a product!';
            createMessageDiv.className = 'message-error';
            return;
        }
        const formData = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value)
        };
        if (!formData.name || !formData.description || !formData.price) {
            createMessageDiv.innerText = 'Please fill in all fields!';
            createMessageDiv.className = 'message-error';
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                createMessageDiv.innerText = 'Product created successfully!';
                createMessageDiv.className = 'message-success';
                document.getElementById('createProductForm').reset();
                await loadProducts();
            } else {
                const errorData = await response.json();
                createMessageDiv.innerText = `Failed to create product: ${errorData.detail || 'Unknown error'}`;
                createMessageDiv.className = 'message-error';
            }
        } catch (error) {
            console.error("Product creation error:", error);
            createMessageDiv.innerText = 'Failed to create product: Network error';
            createMessageDiv.className = 'message-error';
        }
    });
});