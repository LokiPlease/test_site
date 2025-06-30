document.addEventListener('DOMContentLoaded', () => {
    console.log("Loading cart");
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartDiv = document.getElementById('cartItems');
    const messageDiv = document.getElementById('message');
    cartDiv.innerHTML = '';
    if (cartItems.length === 0) {
        cartDiv.innerHTML = '<p class="text-gray-600">Your cart is empty.</p>';
    } else {
        cartItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'border-b py-4 flex justify-between items-center';
            itemDiv.innerHTML = `
                <div>
                    <p class="text-lg font-semibold">${item.name}</p>
                    <p class="text-gray-600">$${item.price}</p>
                </div>
                <button class="btn-danger text-white px-4 py-2 rounded-md remove-from-cart" data-index="${index}">
                    <svg class="h-5 w-5 inline-block mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remove
                </button>
            `;
            cartDiv.appendChild(itemDiv);
        });
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                cartItems.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cartItems));
                messageDiv.innerText = 'Item removed from cart!';
                messageDiv.className = 'message-success';
                document.dispatchEvent(new Event('DOMContentLoaded'));
            });
        });
    }
});