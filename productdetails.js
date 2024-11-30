document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsElement = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    const cartSummary = document.getElementById('cart-summary');
    const cartIcon = document.getElementById('cart-icon');
    const notification = document.getElementById('notification');
    const closeCartButton = document.getElementById('close-cart');

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

    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');
    const productPrice = parseFloat(urlParams.get('price'));
    const productImage = urlParams.get('image');

    // Dynamically update the product details based on the URL parameters
    const productImageElement = document.querySelector('.product-image img');
    const productTitleElement = document.querySelector('.product-details h1');
    const productDescElement = document.querySelector('.product-description');
    const productShadeElement = document.querySelector('.product-shade');
    const productPriceElement = document.createElement('p'); // Create price element
    const productStockElement = document.createElement('p'); // Create stock element

    productImageElement.src = productImage;
    productTitleElement.textContent = productName;
    productShadeElement.textContent = `Shade: Available in multiple options`;
    const discountPrice = calculateDiscount(productPrice);
    
    // Set up price element content
    productPriceElement.innerHTML = `Price: <span class="original-price">$${productPrice.toFixed(2)}</span> <span class="discount-price">$${discountPrice}</span>`;
    
    // Set up stock element initial content
    productStockElement.classList.add('product-stock');
    productStockElement.textContent = `Available Stock: Loading...`;

    // Add a class to create spacing
    productPriceElement.classList.add('product-price');

    // Append stock and price elements in the desired order
    const productDetailsContainer = document.querySelector('.product-details');
    productDetailsContainer.appendChild(productStockElement); // Append stock first
    productDetailsContainer.appendChild(productPriceElement); // Then append price

    // Set the product description, ingredients, and features based on the type of product
    let productDescription = "";
    let productIngredients = "";
    let productFeatures = "";

    if (productName.toLowerCase().includes('foundation')) {
        productDescription = "If you have ultra-dry skin, a moisturiser that doubles up as a foundation is a one-step way to dewy, hydrated coverage.";
        productIngredients = "Water, Silica, Glycerin, Titanium Dioxide, Dimethicone, Cyclopentasiloxane, Iron, Oxides, Talc, Mica, Sodium Hyaluronate, Ethylhexyl Methoxycinnamate, Phenoxyethanol, Benzyl Alcohol, Fragrance, Stearic Acid&quot;";
        productFeatures = "Full coverage, Lightweight, SPF 15.";
    } else if (productName.toLowerCase().includes('lipstick')) {
        productDescription = "This allows you to easily create an intense colour on your lips that stays perfect for up to 12 hours.";
        productIngredients = "Candelilla Wax, Carnauba Wax, Mineral Oil, Fragrance, Castor Oil, Shea Butter, Cocoa Butter, Beeswax, Lanolin, Pigments,Tocopherol (Vitamin E), Sorbitol";
        productFeatures = "Long-lasting, Moisturizing, Highly pigmented.";
    } else if (productName.toLowerCase().includes('eyeshadow')) {
        productDescription = "The only eye palette you need, it features two ultra-fine matte powders and two buttery bouncy creams.";
        productIngredients = "Mica, Talc , Magnesium Stearate , Iron Oxides , Zinc Oxide , Kaolin , Silicone Dioxide, Alumina , Sodium Bicarbonate , Bismuth Oxychloride , Ethylhexyl Palmitate , Tocopheryl Acetate , Squalane , Coconut Oil , Potassium Sorbate";
        productFeatures = "Blendable, Highly pigmented, Long-lasting.";
    } else if (productName.toLowerCase().includes('brush')) {
        productDescription = "Makeup brushes are integral to achieving a flawless, airbrushed look.";
        productIngredients = "Synthetic Bristles, Wooden Handle, Ferrule, Natural Hair Bristles, Plastic Handle, Aluminum Ferrule,Nylon Bristles, Bamboo Handle , Foam Grip , Metal Handle , Rubberized Grip , Polyester Bristles , Silicone Ferrule, Eco-friendly Materials, Decorative Elements";
        productFeatures = "Soft, Durable, Easy to clean.";
    } else if (productName.toLowerCase().includes('eye curler')) {
        productDescription = "Eyelash curlers are the perfect makeup tool to get the curved and visibly longer lashes you desire.";
        productIngredients = "Metal, Rubber Pads, Plastic Handle, Spring Mechanism, Silicone Pads, Stainless Steel, Coating (e.g.,chrome or nickel), Pivot Point, Ergonomic Handle, Tension Bar, Non-slip Grip, Hinge, Protective Cap, Lightweight Frame, Decorative Elements";
        productFeatures = "Gentle, Precise, Ergonomic design.";
    } else if (productName.toLowerCase().includes('blush')) {
        productDescription = "Silky-smooth blushes feel weightless & add a radiant flush of color to cheeks.";
        productIngredients = "Talc, Mica, Iron Oxides, Magnesium Stearate, Silica, Bismuth Oxychloride, Kaolin, Titanium Dioxide ,Zinc Oxide, Glycerin, Sodium Hyaluronate, Fragrance, Preservatives (e.g., Phenoxyethanol), Colorants, Emollients";
        productFeatures = "Buildable, Soft texture, Long-lasting.";
    } else if (productName.toLowerCase().includes('eyeliner pencil')) {
        productDescription = "Gives eyes definition, from high drama to naturally pretty.";
        productIngredients = "Wax, Pigments, Oils, Silicone Compounds, Emollients, Butters (e.g., shea butter), Preservatives, Fillers (e.g., talc), Colorants, Antioxidants (e.g., tocopherol), Film-forming Agents, Fragrance, Thickeners, Stabilizers, Binding Agents";
        productFeatures = "Waterproof, Smooth application, Intense color.";
    } else if (productName.toLowerCase().includes('primer')) {
        productDescription = "Create a smooth surface, enhance makeup longevity, and improve overall appearance.";
        productIngredients = "Water, Silicone Compounds (e.g., Dimethicone), Glycerin, Tocopherol (Vitamin E), Sodium Hyaluronate, Cyclopentasiloxane, Magnesium Sulfate, Niacinamide, Polyethylene, Squalane, Kaolin, Preservatives (e.g., Phenoxyethanol), Fragrance, Colorants, Emollients";
        productFeatures = "Smoothing texture, Long-lasting wear, Skin type compatibility, Hydration, Oil control, Illumination, Pore minimization, Color correction, Easy application, Versatility.";
    } else if (productName.toLowerCase().includes('contour')) {
        productDescription = "Creating shadows and highlights, enhancing natural features and creating dimension.";
        productIngredients = "Talc, Mica, Pigments, Silica, Iron Oxides, Magnesium Stearate, Titanium Dioxide, Bismuth, Oxychloride, Kaolin, Dimethicone, Emollients, Glycerin, Preservatives (e.g., Phenoxyethanol) Colorants, Film-forming Agents";
        productFeatures = "Creates depth and dimension, Defines facial features, Available in various formulations (creams, powders, sticks), Blends easily for a natural look, Buildable coverage, Suitable for different skin tones, Long-lasting wear, Can be used for face and body, Versatile application techniques (brush, sponge, fingers), Enhances the overall makeup look.";
    } else if (productName.toLowerCase().includes('concealer')) {
        productDescription = "Designed to cover imperfections, dark circles, and blemishes, providing a more even skin tone and enhancing the overall look.";
        productIngredients = "Water, Talc, Silicone Compounds (e.g., Dimethicone), Pigments, Glycerin, Cera alba (Beeswax), Iron Oxide, Titanium Dioxide, Magnesium Stearate, Kaolin, Sodium Hyaluronate, Preservatives (e.g., Phenoxyethanol), Emollients, Film-forming Agents, Fragrance";
        productFeatures = "High coverage, lightweight texture, blendable formulation, available in various shades, long-lasting wear, versatile use for face and eyes, hydrating ingredients, oil-free options, buildable coverage, suitable for all skin types.";
    } else if (productName.toLowerCase().includes('eyebrow')) {
        productDescription = "To enhance, shape, and define the eyebrows, helping to frame the face and complete the overall makeup look.";
        productIngredients = "Wax, Pigments, Silicone Compounds, Emollients, Glycerin, Talc, Iron Oxides, Mica, Preservatives (e.g., Phenoxyethanol), Colorants, Film-forming Agents, Fragrance, Cera alba (Beeswax), Sodium Hyaluronate, Thickeners";
        productFeatures = "Variety of products (pencils, powders, gels), easy application, long-lasting formulas, available in multiple shades, waterproof options, buildable coverage, precise control for shaping, natural finish, tames unruly brows, suitable for all brow types.";
    } else if (productName.toLowerCase().includes('brow freeze gel')) {
        productDescription = "To hold eyebrows in place, providing a sleek, groomed look while maintaining a natural appearance.";
        productIngredients = "Water, Glycerin, Acrylates Copolymer, Polyvinyl Alcohol, Silicone Compounds (e.g.,Dimethicone), Waxes (e.g., Beeswax), Tocopherol (Vitamin E), Preservatives (e.g.,Phenoxyethanol), Colorants, Fragrance, PVP (Polyvinylpyrrolidone), Sodium Hyaluronate, Emollients, Thickeners, Film-forming Agents";
        productFeatures = "Strong hold, clear finish, non-crunchy formula, easy application, suitable for all brow types, water-resistant, long-lasting wear, quick-drying, lightweight texture, enhances brow definition.";
    } else if (productName.toLowerCase().includes('bb foundation')) {
        productDescription = "A lightweight makeup product that combines skincare benefits with light coverage, providing a natural finish while evening out the skin tone.";
        productIngredients = "Water, Dimethicone, Glycerin, Titanium Dioxide, Iron Oxides, Cyclopentasiloxane, Niacinamide, Silica Sodium Hyaluronate, Butylene Glycol, Tocopherol (Vitamin E), Preservatives (e.g., Phenoxyethanol), Emollients, Fragrance, Colorants";
        productFeatures = "Hydrating formula, lightweight texture, sheer to medium coverage, contains SPF for sun protection, blurs imperfections, suitable for all skin types, easy application, multifunctional (moisturizer, primer, foundation), natural finish, buildable coverage.";
    } else if (productName.toLowerCase().includes('bronzer')) {
        productDescription = "To add warmth and a sun-kissed glow to the skin, enhancing the complexion and providing a healthy, radiant appearance.";
        productIngredients = "Water, Talc, Mica, Pigments, Silica, Iron Oxides, Magnesium Stearate, Titanium Dioxide, Bismuth Oxychloride, Dimethicone, Glycerin, Preservatives (e.g., Phenoxyethanol), Colorants, Emollients, Kaolin";
        productFeatures = "Variety of formulations (powder, cream, liquid), buildable color, available in various shades, easy to blend, suitable for all skin types, matte or shimmer finishes, enhances facial structure, long-lasting wear, versatile application, adds warmth and dimension.";
    } else if (productName.toLowerCase().includes('clear brow mascara')) {
        productDescription = "to shape, tame, and set eyebrows in place without adding color, providing a polished, natural look.";
        productIngredients = "clear gel, aloe vera gel, glycerin, carbomer, water, preservative, fragrance, coloring agent";
        productFeatures = "Lightweight formula, strong hold, non-sticky finish, easy application, suitable for all brow colors, quick-drying, versatile use for styling and setting, enhances natural brow texture, can be used alone or over other brow products, travel-friendly packaging.";
    } else if (productName.toLowerCase().includes('skin perfector')) {
        productDescription = "To enhance the skin's appearance by providing a smooth, radiant finish, often blurring imperfections and uneven texture.";
        productIngredients = "tinted moisturizer, hyaluronic acid, glycerin, dimethicone, titanium dioxide, zinc oxide, vitamin E, fragrance, preservative";
        productFeatures = "Lightweight formula, blurring effect, available in various finishes (matte, dewy), enhances radiance, suitable for all skin types, can be worn alone or under foundation, hydrating ingredients, buildable coverage, long-lasting wear, versatile application methods.";
    } else if (productName.toLowerCase().includes('tinted moisturizer')) {
        productDescription = "A lightweight skincare product that combines hydration with a hint of color, providing a natural, sheer coverage while evening out the skin tone.";
        productIngredients = "water, glycerin, dimethicone, titanium dioxide, zinc oxide, hyaluronic acid, plant extracts, vitamin E, preservatives, natural oils";
        productFeatures = "Hydrating formula, sheer coverage, lightweight texture, available in multiple shades, contains SPF for sun protection, easy application, suitable for all skin types, blends seamlessly, enhances natural radiance, can be worn alone or under makeup.";
    } else if (productName.toLowerCase().includes('eyelash')) {
        productDescription = "This is a rose gold eyelash curler with two additional eyelash curler pads. The curler has a comfortable grip and a precision-crafted curve to curl your lashes to perfection.";
        productIngredients = "water, glycerin, dimethicone, titanium dioxide, zinc oxide, hyaluronic acid, plant extracts, vitamin E, preservatives, natural oils";
        productFeatures = "Comfortable grip for easy and precise use, Precision-crafted curve to curl lashes to perfection, Durable and long-lasting construction";
    }else if (productName.toLowerCase().includes('floral lip gloss')) {
            productDescription = "This is a white lip gloss with a glossy finish and a hint of shimmer. It is packaged in a sleek, white tube with a doe-foot applicator.";
            productIngredients = "Polybutene, Dimethicone, Ethylhexyl Palmitate, Mica, Titanium Dioxide, Iron Oxides";
            productFeatures = "Glossy finish, Hint of shimmer, Non-sticky formula, Hydrating, Long-lasting";
    }else if (productName.toLowerCase().includes('lip pencil')) {
            productDescription = " It's a long-lasting, creamy lip pencil that defines and fills in lips for a precise and polished look.";
            productIngredients = "Blend of waxes, oils, pigments, and oils, pigments";
            productFeatures = "Long-lasting, Waterproof, Creamy texture, Precise application, Smudge-proof, Versatile";
    }
    
    productDescElement.textContent = productDescription;

    // Update the ingredients and features in the HTML
    const productIngredientsElement = document.querySelector('.product-ingredients span');
    const productFeaturesElement = document.querySelector('.product-features span');
    productIngredientsElement.textContent = productIngredients;
    productFeaturesElement.textContent = productFeatures;

    // Fetch product list to get stock information
    fetch('productlist.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.name === productName);
            if (product) {
                productStockElement.textContent = `Available Stock: ${product.stock}`;
            } else {
                productStockElement.textContent = `Available Stock: Not Found`;
            }
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            productStockElement.textContent = `Available Stock: Error loading stock`;
        });

    // Create and append the Add to Cart button
    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('btn-add-to-cart');
    addToCartButton.textContent = 'Add to Cart';
    productDetailsContainer.appendChild(addToCartButton);

    // Handle Add to Cart button click
    addToCartButton.addEventListener('click', () => {
        const product = {
            name: productName,
            price: discountPrice, // Use the discounted price
            image: productImage,
            quantity: 1 // Initially set quantity to 1
        };

        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            const availableStock = product.stock; // Update this to fetch stock correctly
            if (existingProduct.quantity < availableStock) {
                existingProduct.quantity += 1;
            } else {
                notification.textContent = `Cannot add more than ${availableStock} of ${product.name}.`;
                notification.classList.add('show');
                setTimeout(() => notification.classList.remove('show'), 3000);
                return;
            }
        } else {
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
        updateCart();

        // Show notification
        notification.textContent = `${productName} added to the cart!`;
        notification.classList.add('show');

        // Hide notification after 2 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    });

    // Toggle cart visibility
    cartIcon.addEventListener('click', () => {
        const isVisible = cartSummary.style.display === 'block';
        cartSummary.style.display = isVisible ? 'none' : 'block';
    });

    // Close cart summary
    closeCartButton.addEventListener('click', () => {
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
        localStorage.removeItem('cart');
        cart.length = 0; // Clear the cart array
        updateCart(); // Update the cart UI

        // Display order success notification
        notification.textContent = "Order placed successfully!";
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
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
                            setTimeout(() => notification.classList.remove('show'), 3000);
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
    
    function calculateDiscount(price) {
        if (price > 50) {
            return (price * 0.8).toFixed(2); // 20% discount
        } else if (price >= 30) {
            return (price * 0.9).toFixed(2); // 10% discount
        }
        return price.toFixed(2); // No discount
    }

    function clearCart() {
        localStorage.removeItem('cart');
        cart.length = 0;
        updateCart();
    }

    updateCart();
});