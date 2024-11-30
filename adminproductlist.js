document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsElement = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    const cartSummary = document.getElementById('cart-summary');
    const cartIcon = document.getElementById('cart-icon');
    const notification = document.getElementById('notification');
    const closeCartButton = document.getElementById('close-cart');
    const categorySelect = document.getElementById('category-select');
    const searchBar = document.getElementById('search-bar');
    const sortSelect = document.getElementById('sort-select');
    const productGrid = document.getElementById('product-grid');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const addProductBtn = document.getElementById('add-product-btn');
    const productForm = document.getElementById('product-form');
    const saveProductBtn = document.getElementById('save-product-btn');
    const cancelProductBtn = document.getElementById('cancel-product-btn');

    const itemsPerPage = 10;
    let currentPage = 1;
    let products = [];

    const productCategories = {
        all: [],
        face: ['Foundation', 'Brush', 'Primer', 'Concealer', 'Contour', 'BB Foundation', 'Bronzer', 'Skin Perfector', 'Tinted Moisturizer'],
        lips: ['Lipstick', 'Floral Lip Gloss', 'Lip Pencil', 'Matte Lipstick'],
        blush:['Blush', 'Powder Blush'],
        eyes: ['Eyeshadow', 'Eyelash', 'EyeLiner Pencil'],
        brows: ['Eyebrow', 'Brow Freeze Gel', 'Clear Brow Mascara']
    };


    const checkoutNotification = document.createElement('div');
    checkoutNotification.id = 'checkout-notification';
    checkoutNotification.classList.add('hidden');
    checkoutNotification.innerHTML = `
        <button class="close-btn">&times;</button>
        <h3>Confirm Order</h3>
        <p>Are you sure you want to place this order?</p>
        <button class="btn place-order-btn">Place Order</button>
    `;
    document.body.appendChild(checkoutNotification);

    // Function to display a notification message
    function displayNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    saveProductBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const productName = document.getElementById('product-name').value;
        const productDescription = document.getElementById('product-description').value;
        const productPrice = document.getElementById('product-price').value;
        const productStock = document.getElementById('product-stock').value;
        const productShade = document.getElementById('product-shade').value;
        const productImage = document.getElementById('product-image').value;

        const newProduct = {
            name: productName,
            description: productDescription,
            price: productPrice,
            stock: productStock,
            shades: productShade,
            image: productImage
        };

        // Check if the product is being edited or added
        if (saveProductBtn.textContent === 'Save') {
            products.push(newProduct);
            productCategories.all.push(newProduct);
            displayNotification('Product added successfully!');
        } else {
            const productIndex = products.findIndex(p => p.name === productName);
            if (productIndex !== -1) {
                products[productIndex] = newProduct;
                productCategories.all = products; // Update the all category
                displayNotification('Product updated successfully!');
            }
        }

        productForm.classList.add('hidden');
        displayProducts();
        updatePagination();
        saveProductBtn.textContent = 'Save'; // Reset the button text
    });

    // Delete product functionality
    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            // Find the product item containing the delete button
            const productItem = event.target.closest('.product-item');

            // Get the product name from the product item
            const productName = productItem.querySelector('h3').textContent;

            // Find the index of the product in the products array
            const productIndex = products.findIndex(p => p.name === productName);

            // If the product is found, remove it
            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                productCategories.all = products; // Update the all category
                productItem.remove();
                displayNotification('Product deleted successfully!'); // Display notification
                updatePagination();
                displayProducts();
            }
        }
    });

    // Delete product functionality
    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            // Find the product item containing the delete button
            const productItem = event.target.closest('.product-item');

            // Get the product name from the product item
            const productName = productItem.querySelector('h3').textContent;

            // Find the index of the product in the products array
            const productIndex = products.findIndex(p => p.name === productName);

            // If the product is found, remove it
            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                productCategories.all = products; // Update the all category
                productItem.remove();
                displayNotification('Product deleted successfully!'); // Display notification
                updatePagination();
                displayProducts();
            }
        }
    });

    // Fetch and display products
    fetch('productlist.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            productCategories.all = products; // Store all products for filtering
            setupEventListeners();
            updatePagination();
            displayProducts(products);

            categorySelect.addEventListener('change', filterProducts);
            searchBar.addEventListener('input', filterProducts);
        })
        .catch(error => console.error('Error loading products:', error));

    function setupEventListeners() {
        categorySelect.addEventListener('change', () => {
            currentPage = 1;
            updatePagination();
            displayProducts();
        });

        searchBar.addEventListener('input', () => {
            currentPage = 1;
            updatePagination();
            displayProducts();
        });

        sortSelect.addEventListener('change', () => {
            currentPage = 1;
            updatePagination();
            displayProducts();
        });

        prevPageButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
                displayProducts();
            }
        });

        nextPageButton.addEventListener('click', () => {
            if (currentPage < Math.ceil(getFilteredProducts().length / itemsPerPage)) {
                currentPage++;
                updatePagination();
                displayProducts();
            }
        });

        addProductBtn.addEventListener('click', () => {
            productForm.classList.remove('hidden');
        });

        cancelProductBtn.addEventListener('click', () => {
            productForm.classList.add('hidden');
            // Clear form inputs here
            document.getElementById('product-name').value = '';
            document.getElementById('product-description').value = '';
            document.getElementById('product-price').value = '';
            document.getElementById('product-stock').value = '';
            document.getElementById('product-shade').value = '';
            document.getElementById('product-image').value = '';
        });

        saveProductBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const productName = document.getElementById('product-name').value;
            const productDescription = document.getElementById('product-description').value;
            const productPrice = document.getElementById('product-price').value;
            const productStock = document.getElementById('product-stock').value;
            const productShade = document.getElementById('product-shade').value;
            const productImage = document.getElementById('product-image').value;

            const newProduct = {
                name: productName,
                description: productDescription,
                price: productPrice,
                stock: productStock,
                shades: productShade,
                image: productImage
            };

            products.push(newProduct);
            productCategories.all.push(newProduct);
            productForm.classList.add('hidden');
            displayProducts();
            updatePagination();
            displayProducts();
        });
    }
    
    function getFilteredProducts() {
        const selectedCategory = categorySelect.value;
        const searchTerm = searchBar.value.toLowerCase();
        let filteredProducts = productCategories.all;

        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product =>
                productCategories[selectedCategory].includes(product.name)
            );
        }

        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );
        }

        return filteredProducts;
    }

    function displayProducts() {
    const filteredProducts = getFilteredProducts();
    const sortValue = sortSelect.value;

    if (sortValue === 'price') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'popularity') {
        filteredProducts.sort((a, b) => b.popularity - a.popularity); // Sort by popularity
    } else if (sortValue === 'newest') {
        filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)); // Sort by date added
    }

    // Remove duplicates
    const uniqueProducts = filteredProducts.reduce((unique, product) => {
        if (!unique.some(p => p.name === product.name)) {
            unique.push(product);
        }
        return unique;
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToDisplay = uniqueProducts.slice(startIndex, endIndex);

    productGrid.innerHTML = ''; // Clear previous products

    productsToDisplay.forEach(product => {
        const discountPrice = calculateDiscount(product.price);
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            <a href="adminproductdetails.html?name=${product.name}&price=${product.price}&image=${product.image}">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <h3>${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            <p class="product-shade">Shade: ${product.shades}</p>
            <p class="product-stock">Stock: ${product.stock}</p>
            <p class="product-price">Price: <span class="original-price">$${product.price}</span> <span class="discount-price">$${discountPrice}</span></p>
            <button class="btn-add-to-cart">Add to Cart</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        productGrid.appendChild(productElement);

            const addToCartButton = productElement.querySelector('.btn-add-to-cart');
            addToCartButton.addEventListener('click', () => addToCart(product, discountPrice));

            const editButton = productElement.querySelector('.edit-btn');
            editButton.addEventListener('click', () => {
                const productName = product.name;
                const productPrice = product.price;
                const productStock = product.stock;
                const productShade = product.shades;
                const productImage = product.image;
                const productDescription = product.description; // Add this line

                document.getElementById('product-name').value = productName;
                document.getElementById('product-price').value = productPrice;
                document.getElementById('product-stock').value = productStock;
                document.getElementById('product-shade').value = productShade;
                document.getElementById('product-image').value = productImage;
                document.getElementById('product-description').value = productDescription; // Add this line

                productForm.classList.remove('hidden');
                saveProductBtn.textContent = 'Update';

                saveProductBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    const updatedProductName = document.getElementById('product-name').value;
                    const updatedProductPrice = document.getElementById('product-price').value;
                    const updatedProductStock = document.getElementById('product-stock').value;
                    const updatedProductShade = document.getElementById('product-shade').value;
                    const updatedProductImage = document.getElementById('product-image').value;
                    const updatedProductDescription = document.getElementById('product-description').value; // Add this line

                    const productIndex = products.findIndex(p => p.name === productName);
                    if (productIndex !== -1) {
                        products[productIndex] = {
                            name: updatedProductName,
                            description: updatedProductDescription, // Add this line
                            price: updatedProductPrice,
                            stock: updatedProductStock,
                            shades: updatedProductShade,
                            image: updatedProductImage
                        };

                        productCategories.all = products; // Update the all category
                        productForm.classList.add('hidden');
                        displayProducts();
                        updatePagination();
                        saveProductBtn.textContent = 'Save';
                    }
                });
            });

            const deleteButton = productElement.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => {
                const productIndex = products.findIndex(p => p.name === product.name);
                if (productIndex !== -1) {
                    products.splice(productIndex, 1);
                    productCategories.all = products; // Update the all category
                    productElement.remove();
                    updatePagination();
                    displayProducts();
                    displayNotification('Product deleted successfully!'); // Display notification
                }
            });
        });
        // Add an event listener to the product grid for delete button clicks
    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const productItem = event.target.closest('.product-item');
            const productName = productItem.querySelector('h3').textContent;

            // Find the product in the array
            const productIndex = products.findIndex(p => p.name === productName);

            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                productCategories.all = products;
                productItem.remove();

                // Display the notification message
                displayNotification('Product deleted successfully!');

                // Update pagination and re-render the product list
                updatePagination();
                displayProducts();
            }
        }
    });
    }

    function updatePagination() {
        const filteredProducts = getFilteredProducts();
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages || totalPages === 0;
    }

    function addToCart(product, discountPrice) {
        if (!product.name || product.name.trim() === "") {
            notification.textContent = "Product name is missing. Cannot add to cart!";
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 3000);
            return;
        }

        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            if (existingProduct.quantity < product.stock) {
                existingProduct.quantity += 1;
            } else {
                notification.textContent = `Cannot add more than ${product.stock} of ${product.name}.`;
                notification.classList.add('show');
                setTimeout(() => notification.classList.remove('show'), 3000);
                return;
            }
        } else {
            cart.push({
                name: product.name,
                price: discountPrice,
                image: product.image,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        notification.textContent = `${product.name} added to the cart!`;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    function calculateDiscount(price) {
        if (price > 50) {
            return (price * 0.8).toFixed(2);
        } else if (price >= 30) {
            return (price * 0.9).toFixed(2);
        }
        return price.toFixed(2);
    }

    // Toggle cart visibility
    cartIcon.addEventListener('click', () => {
        const isVisible = cartSummary.style.display === 'block';
        cartSummary.style.display = isVisible ? 'none' : 'block';
    });

    document.getElementById('close-cart').addEventListener('click', () => {
        cartSummary.style.display = 'none';
    });

    // Checkout button functionality
    const checkoutButton = document.querySelector('.view-cart-btn');
    checkoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            notification.textContent = "Your cart is empty. Please add products to your cart before checkout.";
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 3000);
        } else {
            checkoutNotification.classList.remove('hidden');
        }
    });

    // Close checkout notification box
    checkoutNotification.querySelector('.close-btn').addEventListener('click', () => {
        checkoutNotification.classList.add('hidden');
    });

    // Place Order button functionality
    checkoutNotification.querySelector('.place-order-btn').addEventListener('click', () => {
        checkoutNotification.classList.add('hidden');
        notification.textContent = "Order placed successfully!";
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
        clearCart();
    });
    // Function to update cart display
    function updateCart() {
        cartItemsElement.innerHTML = '';
        fetch('productlist.json')
            .then(response => response.json())
            .then(products => {
                const productMap = products.reduce((map, product) => {
                    map[product.name] = product.stock;
                    return map;
                }, {});
    
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div>${item.name} - $${item.price} x ${item.quantity}</div>
                        <div class="quantity-wrapper">
                            <button class="btn-decrease-quantity">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="btn-increase-quantity">+</button>
                        </div>
                        <img src="images/remove.png" alt="Remove" class="btn-remove-item" style="cursor: pointer; width: 20px; height: 20px;">
                    `;
                    cartItemsElement.appendChild(cartItem);
    
                    const decreaseButton = cartItem.querySelector('.btn-decrease-quantity');
                    const increaseButton = cartItem.querySelector('.btn-increase-quantity');
    
                    decreaseButton.addEventListener('click', () => {
                        if (item.quantity > 1) {
                            item.quantity -= 1;
                        } else {
                            const index = cart.indexOf(item);
                            cart.splice(index, 1);
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCart();
                    });
    
                    increaseButton.addEventListener('click', () => {
                        const availableStock = productMap[item.name];
                        if (item.quantity < availableStock) {
                            item.quantity += 1;
                        } else {
                            notification.textContent = `Cannot add more than ${availableStock} of ${item.name}.`;
                            notification.classList.add('show');
                            setTimeout(() => notification.classList.remove('show'), 2000);
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCart();
                    });
    
                    // Update the remove button functionality
                    const removeButton = cartItem.querySelector('.btn-remove-item');
                    removeButton.addEventListener('click', () => {
                        const index = cart.indexOf(item);
                        cart.splice(index, 1);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCart();
                    });
                });
    
                const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                totalAmountElement.textContent = `Total: $${totalAmount.toFixed(2)}`;
            });
    }

    function clearCart() {
        localStorage.removeItem('cart');
        cart.length = 0;
        updateCart();
    }

    updateCart();
});