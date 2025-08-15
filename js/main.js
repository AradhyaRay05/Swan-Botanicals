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
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="font-subheading text-lg">${item.name}</h4>
                        <p class="text-rich-umber">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <input type="number" value="${item.quantity}" min="1" class="form-control w-20 text-center cart-quantity-input" aria-label="Quantity for ${item.name}">
                        <button class="btn btn-sm btn-outline-danger cart-remove-btn" aria-label="Remove ${item.name} from cart">Remove</button>
                    </div>
                </div>
            `;
            cartContainer.innerHTML += cartItemHTML;
        });
        
        const cartTotalsHTML = `
            <div class="mt-8 flex justify-end">
                <div class="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-sm">
                    <h3 class="font-heading text-2xl mb-4">Cart Total</h3>
                    <div class="flex justify-between font-subheading text-lg border-b pb-2 mb-2">
                        <span>Subtotal</span>
                        <span id="cart-subtotal">$${subtotal.toFixed(2)}</span>
                    </div>
                    <button class="btn btn-primary w-full mt-4">Proceed to Checkout</button>
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

            if(target.matches('.cart-remove-btn')) {
                cart = cart.filter(item => item.id !== productId);
            }
            saveCart(cart);
            renderCartPage();
            updateCartCount();
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