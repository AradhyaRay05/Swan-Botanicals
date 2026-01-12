document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy');
    if ("IntersectionObserver" in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    observer.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(image => {
            lazyImageObserver.observe(image);
        });
    }
    const counters = document.querySelectorAll('.animated-counter');
    const speed = 200; // The lower the #, the faster the count

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    };
    
    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); 

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    const CART_KEY = 'swanBotanicalsCart';
    const getCart = () => JSON.parse(localStorage.getItem(CART_KEY)) || [];
    const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

    const updateCartCount = () => {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
        }
    };
    
    const addToCart = (product) => {
        const cart = getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart(cart);
        updateCartCount();
        
        // Simple user feedback
        const btn = document.querySelector(`.add-to-cart-btn[data-id='${product.id}']`);
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Added!';
            setTimeout(() => { btn.innerHTML = originalText }, 1500);
        }
    };

    document.body.addEventListener('click', (e) => {
        if (e.target.matches('.add-to-cart-btn')) {
            const product = {
                id: e.target.dataset.id,
                name: e.target.dataset.name,
                price: parseFloat(e.target.dataset.price),
                img: e.target.dataset.img
            };
            addToCart(product);
        }
    });

    // --- Cart Page Rendering ---
    const renderCartPage = () => {
        const cartContainer = document.getElementById('cart-container');
        const cartEmptyMessage = document.getElementById('cart-empty');
        if (!cartContainer || !cartEmptyMessage) return;

        const cart = getCart();
        cartContainer.innerHTML = '';

        if (cart.length === 0) {
            cartEmptyMessage.classList.remove('hidden');
            cartContainer.classList.add('hidden');
            return;
        }
        
        cartEmptyMessage.classList.add('hidden');
        cartContainer.classList.remove('hidden');
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image-wrapper">
                        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                        <span class="cart-item-badge">In Stock</span>
                    </div>
                    <div class="cart-item-details">
                        <h4 class="font-subheading">${item.name}</h4>
                        <p class="cart-item-meta">Natural • Cruelty-Free</p>
                        <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-wrapper">
                            <button class="quantity-btn quantity-decrease" aria-label="Decrease quantity">−</button>
                            <input type="number" value="${item.quantity}" min="1" class="form-control cart-quantity-input" aria-label="Quantity for ${item.name}">
                            <button class="quantity-btn quantity-increase" aria-label="Increase quantity">+</button>
                        </div>
                        <p class="cart-item-total">₹${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="cart-remove-btn" aria-label="Remove ${item.name} from cart">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>
            `;
            cartContainer.innerHTML += cartItemHTML;
        });

        const shipping = subtotal >= 500 ? 0 : 49;
        const total = subtotal + shipping;
        
        const cartTotalsHTML = `
            <div class="cart-sidebar">
                <div class="cart-promo">
                    <span>${subtotal >= 500 ? 'Congratulations! You qualify for FREE shipping!' : `Add ₹${(500 - subtotal).toFixed(2)} more for FREE shipping`}</span>
                </div>
                <div class="cart-totals-box">
                    <h3 class="font-heading">Order Summary</h3>
                    <div class="cart-summary-row">
                        <span>Subtotal</span>
                        <span>₹${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="cart-summary-row">
                        <span>Shipping</span>
                        <span>${shipping === 0 ? '<span class="free-shipping">FREE</span>' : '₹' + shipping.toFixed(2)}</span>
                    </div>
                    <div class="cart-summary-row cart-total-row">
                        <span>Total</span>
                        <span id="cart-subtotal">₹${total.toFixed(2)}</span>
                    </div>
                    <button class="btn btn-primary w-100 checkout-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 8px;">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                        Secure Checkout
                    </button>
                    <div class="cart-security">
                        <div class="security-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0z"/>
                            </svg>
                            Secure Payment
                        </div>
                        <div class="security-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                            30-Day Returns
                        </div>
                    </div>
                    <a href="products.html" class="continue-shopping">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                        Continue Shopping
                    </a>
                </div>
            </div>
        `;
        cartContainer.innerHTML += cartTotalsHTML;
    };

    // Cart Page Event Handlers
    const cartContainer = document.getElementById('cart-container');
    if(cartContainer) {
        cartContainer.addEventListener('click', e => {
            const target = e.target;
            const cartItem = target.closest('.cart-item');
            if (!cartItem) return;

            const productId = cartItem.dataset.id;
            let cart = getCart();

            if(target.closest('.cart-remove-btn')) {
                cart = cart.filter(item => item.id !== productId);
                saveCart(cart);
                renderCartPage();
                updateCartCount();
            }

            // Handle quantity increase
            if(target.matches('.quantity-increase')) {
                const itemToUpdate = cart.find(item => item.id === productId);
                if (itemToUpdate) {
                    itemToUpdate.quantity += 1;
                    saveCart(cart);
                    renderCartPage();
                    updateCartCount();
                }
            }

            // Handle quantity decrease
            if(target.matches('.quantity-decrease')) {
                const itemToUpdate = cart.find(item => item.id === productId);
                if (itemToUpdate && itemToUpdate.quantity > 1) {
                    itemToUpdate.quantity -= 1;
                    saveCart(cart);
                    renderCartPage();
                    updateCartCount();
                }
            }
        });

        cartContainer.addEventListener('change', e => {
            if(e.target.matches('.cart-quantity-input')) {
                const cartItem = e.target.closest('.cart-item');
                const productId = cartItem.dataset.id;
                const newQuantity = parseInt(e.target.value);
                let cart = getCart();
                const itemToUpdate = cart.find(item => item.id === productId);

                if (itemToUpdate && newQuantity > 0) {
                    itemToUpdate.quantity = newQuantity;
                } else {
                    cart = cart.filter(item => item.id !== productId);
                }
                saveCart(cart);
                renderCartPage();
                updateCartCount();
            }
        });
    }

    // --- Product Page Functionality ---
    const filterContainer = document.getElementById('product-filters');
    const productGrid = document.getElementById('product-grid');
    if (filterContainer && productGrid) {
        const productCards = productGrid.querySelectorAll('.product-card');
        filterContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelector('.btn-filter.active').classList.remove('active');
                e.target.classList.add('active');
                const filter = e.target.dataset.filter;
                productCards.forEach(card => {
                    card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
                });
            }
        });
    }

    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const card = button.closest('.product-card');
            const name = card.querySelector('h4').textContent;
            const price = card.querySelector('p').textContent;
            const img = card.querySelector('img').src;
            const description = button.dataset.description;
            const productData = card.querySelector('.add-to-cart-btn').dataset;

            productModal.querySelector('#modal-product-img').src = img;
            productModal.querySelector('#modal-product-name').textContent = name;
            productModal.querySelector('#modal-product-price').textContent = price;
            productModal.querySelector('#modal-product-description').textContent = description;
            const modalBtn = productModal.querySelector('#modal-add-to-cart-btn');
            Object.assign(modalBtn.dataset, productData);
            modalBtn.classList.add('add-to-cart-btn');
        });
    }

    // --- Form Validation (Contact & Newsletter) ---
    const validateForm = (form) => {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(input => {
            const parent = input.parentElement;
            let errorMsg = parent.querySelector('.invalid-feedback');
            if(!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'invalid-feedback';
                parent.appendChild(errorMsg);
            }
            const validity = input.checkValidity();
            if (!validity) {
                isValid = false;
                input.classList.add('is-invalid');
                if (input.validity.valueMissing) {
                    errorMsg.textContent = 'This field is required.';
                } else if (input.validity.typeMismatch) {
                     errorMsg.textContent = 'Please enter a valid email address.';
                }
            } else {
                input.classList.remove('is-invalid');
                errorMsg.textContent = '';
            }
        });
        return isValid;
    };
    
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackEl = document.getElementById('newsletter-feedback');
            if (validateForm(newsletterForm)) {
                feedbackEl.innerHTML = '<p class="text-leaf-green">Thank you for subscribing!</p>';
                newsletterForm.reset();
            }
        });
    }

    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackEl = document.getElementById('contact-feedback');
            if (validateForm(contactForm)) {
                feedbackEl.innerHTML = '<div class="alert alert-success" role="alert">Thank you for your message! We will get back to you shortly.</div>';
                contactForm.reset();
            } else {
                 feedbackEl.innerHTML = '<div class="alert alert-danger" role="alert">Please correct the errors before submitting.</div>';
            }
        });
    }

    updateCartCount();
    if (document.getElementById('cart-container')) {
        renderCartPage();
    }
});