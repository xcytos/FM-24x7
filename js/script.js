// DOM Elements
const productsContainer = document.getElementById('products-container');
const categoryItems = document.querySelectorAll('.category-item');
const searchInput = document.getElementById('search-input');
const cartBtn = document.getElementById('cart-btn');
const cartCountElement = document.querySelector('.cart-count');
const locationSelector = document.getElementById('location-selector');
const currentLocationElement = document.getElementById('current-location');
const locationModal = document.getElementById('location-modal');
const currentLocationOption = document.getElementById('current-location-option');
const saveAddressBtn = document.getElementById('save-address-btn');
const manualAddressInput = document.getElementById('manual-address');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const profileBtn = document.getElementById('profile-btn');
const loginModal = document.getElementById('login-modal');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminLoginModal = document.getElementById('admin-login-modal');
const adminLoginForm = document.getElementById('admin-login-form');
const registerModal = document.getElementById('register-modal');
const profileModal = document.getElementById('profile-modal');
const ordersModal = document.getElementById('orders-modal');
const ordersList = document.getElementById('orders-list');
const orderHistoryBtn = document.getElementById('order-history-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const profileName = document.getElementById('profile-name');
const profilePhone = document.getElementById('profile-phone');
const profileAddress = document.getElementById('profile-address');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const closeModalButtons = document.querySelectorAll('.close-modal');
const adminProductModal = document.getElementById('admin-product-modal');
const addProductBtn = document.getElementById('add-product-btn');
const adminProductsList = document.getElementById('admin-products-list');
const productFormModal = document.getElementById('product-form-modal');
const productForm = document.getElementById('product-form');
const productCategorySelect = document.getElementById('product-category');
const categorySpecificFields = document.getElementById('category-specific-fields');
const deliveryNotification = document.getElementById('delivery-notification');
const closeDeliveryNotification = document.getElementById('close-delivery-notification');
const deliveryTimeDisplay = document.getElementById('delivery-time');
const orderSuccessModal = document.getElementById('order-success-modal');
// Get the current delivery time from the notification bar
const deliveryTime = document.getElementById('delivery-time')?.textContent || '12';


// App State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let user = JSON.parse(localStorage.getItem('user'));
let userLocation = JSON.parse(localStorage.getItem('location'));
let isAdmin = localStorage.getItem('isAdmin') === 'true';
let products = JSON.parse(localStorage.getItem('products')) || productsData;

// Initialize the page
function init() {

  user = JSON.parse(localStorage.getItem('user'));
  isAdmin = localStorage.getItem('isAdmin') === 'true';
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  userLocation = JSON.parse(localStorage.getItem('location'));

  loadState();
  setupEventListeners();

  //consolelogs
  console.log('[init] Checking delivery notification');
  const deliveryInfo = JSON.parse(localStorage.getItem('deliveryNotification'));
  if (deliveryInfo) {
    console.log('[init] Found delivery info:', deliveryInfo);
  }

  if (document.getElementById('products-container')) {
    console.log('[init] Rendering products');
    renderProducts('all');
  }
  
  if (document.getElementById('cart-items')) {
    console.log('[init] Initializing cart page');
    initCartPage();
  }

   // Check for delivery notification to show

   if (deliveryInfo && deliveryInfo.show) {
     // Check if less than 5 minutes old (300000ms)
     const currentTime = new Date().getTime();
     if (currentTime - deliveryInfo.timestamp < 300000) {
       const remainingMinutes = Math.max(1, deliveryInfo.minutes - 
         Math.floor((currentTime - deliveryInfo.timestamp) / 60000));
       showDeliveryNotification(remainingMinutes);
     } else {
       localStorage.removeItem('deliveryNotification');
     }
   }
  
   // Update category names in the UI
   const categoryItems = document.querySelectorAll('.category-item');
   if (categoryItems.length >= 3) {
     
   }
   
  if (document.getElementById('products-container')) {
    renderProducts('all');
  }
  
  if (document.getElementById('cart-items')) {
    initCartPage();
  }
  
  updateUI();
    console.log('[init] Initialization complete');
}

function loadState() {
  user = JSON.parse(localStorage.getItem('user')) || null;
  isAdmin = localStorage.getItem('isAdmin') === 'true';
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  userLocation = JSON.parse(localStorage.getItem('location')) || null;
}

function updateUI() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!currentUser;

    if (loginBtn && registerBtn && profileBtn) {
    loginBtn.style.display = isLoggedIn ? 'none' : 'block';
    registerBtn.style.display = isLoggedIn ? 'none' : 'block';
    profileBtn.style.display = isLoggedIn ? 'block' : 'none';
  }
  
  updateCartUI();
  updateLocationUI();
  updateAuthUI();
  
  if (isAdmin && !document.querySelector('.btn-admin')) {
    addAdminButton();
  }
}

function addAdminButton() {
  const adminBtn = document.createElement('button');
  adminBtn.className = 'btn btn-admin';
  adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin';
  adminBtn.onclick = () => {
    adminProductModal.style.display = 'flex';
    renderAdminProducts();
  };
  document.querySelector('.header-actions').prepend(adminBtn);
}

// Set up event listeners
function setupEventListeners() {
  // Category selection
  if (categoryItems) {
    categoryItems.forEach(item => {
      item.addEventListener('click', () => {
        categoryItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const category = item.getAttribute('data-category');
        renderProducts(category, searchInput.value);
      });
    });
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const activeCategory = document.querySelector('.category-item.active')?.getAttribute('data-category') || 'all';
      renderProducts(activeCategory, searchInput.value);
    });
  }

  // Cart button
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }

  // Location selection
  if (locationSelector) {
    locationSelector.addEventListener('click', () => {
      locationModal.style.display = 'flex';
    });
  }

  if (currentLocationOption) {
    currentLocationOption.addEventListener("click", getCurrentLocation);
  }

  if (saveAddressBtn) {
    saveAddressBtn.addEventListener("click", saveManualLocation);
  }

  // Auth buttons
  if (loginBtn) loginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
  if (adminLoginBtn) adminLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
    adminLoginModal.style.display = 'flex';
  });
  if (registerBtn) registerBtn.addEventListener('click', () => registerModal.style.display = 'flex');
  if (profileBtn) profileBtn.addEventListener('click', showProfileModal);
  if (orderHistoryBtn) orderHistoryBtn.addEventListener('click', showOrderHistory);
  if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);

  // Forms
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (adminLoginForm) adminLoginForm.addEventListener('submit', handleAdminLogin);
  if (registerForm) registerForm.addEventListener('submit', handleRegister);
  
  // Admin product management
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
      productForm.reset();
      document.getElementById('product-form-title').textContent = 'Add New Product';
      productFormModal.style.display = 'flex';
    });
  }

  if (productCategorySelect) {
    productCategorySelect.addEventListener('change', showCategoryFields);
  }
  
  if (productForm) {
    productForm.addEventListener('submit', handleProductFormSubmit);
  }

  // Close modals
  closeModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });

  // Close modals when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  if (closeDeliveryNotification) {
    closeDeliveryNotification.addEventListener('click', hideDeliveryNotification);
  }

  // Listen for storage changes to sync between tabs
  window.addEventListener('storage', () => {
    loadState();
    updateUI();
    if (document.getElementById('cart-items')) {
      renderCartItems();
    }
  });
}
console.log('Script initialized');
console.log('Initial cart:', JSON.parse(localStorage.getItem('cart')));
console.log('Current user:', JSON.parse(localStorage.getItem('user')));

function showDeliveryNotification(minutes) {
  if (!deliveryNotification) return;
  
  // Clear any existing timeout
  if (window.deliveryNotificationTimeout) {
    clearTimeout(window.deliveryNotificationTimeout);
  }
  
  // Update time display
  deliveryTimeDisplay.textContent = minutes;
  // Get the current delivery time from the notification bar

document.getElementById('delivery-minutes').textContent = `${deliveryTime}-min`;

  
  // Show notification
  deliveryNotification.style.display = 'flex';
  deliveryNotification.style.animation = 'slideIn 0.5s ease-out';
  
  // Hide after 5 minutes (300000ms)
  window.deliveryNotificationTimeout = setTimeout(() => {
    hideDeliveryNotification();
  }, 300000);
}

function hideDeliveryNotification() {
  if (!deliveryNotification) return;
  
  deliveryNotification.style.animation = 'slideOut 0.5s ease-out';
  
  setTimeout(() => {
    deliveryNotification.style.display = 'none';
  }, 500);
}



// Cart page initialization
function initCartPage() {
  renderCartItems();
  setupCartEventListeners();
}

// Cart Functions
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
      </div>
    `;
    return;
  }
  
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h3 class="cart-item-title">${item.name}</h3>
        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <input type="number" class="quantity" value="${item.quantity}" min="1" data-id="${item.id}">
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
          </div>
          <button class="remove-item" data-id="${item.id}">
            <i class="fas fa-trash"></i>
            Remove
          </button>
        </div>
      </div>
    `;
    
    cartItemsContainer.appendChild(cartItem);
  });
  
  updateCartTotals();
}


function setupCartEventListeners() {
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }
  
  checkoutBtn.addEventListener('click', function() {
  // Generate random order ID
  document.getElementById('order-id-display').textContent = 'FM-' + Math.floor(Math.random() * 1000000);
  
  // Use the same delivery time from the notification bar
  const deliveryTime = document.getElementById('delivery-time')?.textContent || '12';
  document.getElementById('delivery-minutes').textContent = `${deliveryTime}-min`;

  // Copy cart total into success modal
  const totalAmount = document.getElementById('cart-total')?.textContent || '$0.00';
  document.querySelector('#order-success-modal .order-summary .summary-row span:last-child').textContent = totalAmount;

  // Show the modal
  orderSuccessModal.style.display = 'block';

  // Reset animations
  resetDeliveryAnimations();
});


  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('minus')) {
      const productId = e.target.getAttribute('data-id');
      updateQuantity(productId, -1);
    }
    
    if (e.target.classList.contains('plus')) {
      const productId = e.target.getAttribute('data-id');
      updateQuantity(productId, 1);
    }
    
    if (e.target.classList.contains('remove-item')) {
      const productId = e.target.getAttribute('data-id');
      removeFromCart(productId);
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('quantity')) {
      const productId = e.target.getAttribute('data-id');
      const newQuantity = parseInt(e.target.value) || 1;
      setQuantity(productId, newQuantity);
    }
  });
}

function resetDeliveryAnimations() {
  console.log('[resetDeliveryAnimations] Resetting animations');
  
  try {
    const progressFill = document.querySelector('.progress-fill');
    const deliveryBike = document.querySelector('.delivery-bike');

    if (progressFill) {
      console.log('[resetDeliveryAnimations] Resetting progress bar');
      progressFill.style.animation = 'none';
      void progressFill.offsetWidth;
      progressFill.style.animation = 'fillProgress 4s linear forwards';
    }

    if (deliveryBike) {
      console.log('[resetDeliveryAnimations] Resetting bike animation');
      deliveryBike.style.animation = 'none';
      void deliveryBike.offsetWidth;
      deliveryBike.style.animation = 'moveBike 4s linear forwards';
    }
  } catch (error) {
    console.error('[resetDeliveryAnimations] Error:', error);
  }
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  const newQuantity = item.quantity + change;
  if (newQuantity < 1) {
    removeFromCart(productId);
  } else {
    item.quantity = newQuantity;
    updateCart();
  }
}

function setQuantity(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  if (quantity < 1) {
    removeFromCart(productId);
  } else {
    item.quantity = quantity;
    updateCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  showToast('Item removed from cart');
}

function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;
  
  document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('delivery-fee').textContent = `$${deliveryFee.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}


function checkout() {
  console.log('[checkout] Starting checkout process');
  
  try {
    if (!user) {
      console.warn('[checkout] No user logged in');
      showToast('Please login to proceed with checkout');
      loginModal.style.display = 'flex';
      return;
    }
    
    if (cart.length === 0) {
      console.warn('[checkout] Empty cart attempted checkout');
      showToast('Your cart is empty');
      return;
    }
    
    if (!userLocation) {
      console.warn('[checkout] No location selected');
      showToast('Please select a delivery location first');
      return;
    }

    console.log('[checkout] Calculating totals');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const total = subtotal + deliveryFee;
    const deliveryMinutes = Math.floor(Math.random() * 3) + 10;

    console.log('[checkout] Cart contents:', JSON.stringify(cart));
    console.log(`[checkout] Calculated totals - Sub: ${subtotal}, Delivery: ${deliveryFee}, Total: ${total}`);

    const order = {
      id: 'FM-' + Math.floor(Math.random() * 1000000),
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      location: userLocation,
      status: 'preparing',
      deliveryMinutes: deliveryMinutes
    };

    console.log('[checkout] Created order:', order);

    user.orders = user.orders || [];
    user.orders.unshift(order);
    localStorage.setItem('user', JSON.stringify(user));
    console.log('[checkout] Saved order to user');

    showOrderSuccess(order);
    console.log('[checkout] Showed order success');

    cart = [];
    updateCart();
    console.log('[checkout] Cleared cart');

    showDeliveryNotification(deliveryMinutes);
    localStorage.setItem('deliveryNotification', JSON.stringify({
      show: true,
      minutes: deliveryMinutes,
      timestamp: new Date().getTime()
    }));
    console.log('[checkout] Set delivery notification');

  } catch (error) {
    console.error('[checkout] Error during checkout:', error);
    showToast('Error during checkout process');
  }
}

function showOrderSuccess(order) {
  console.log('[showOrderSuccess] Displaying order success for:', order.id);
  
  try {
    if (!orderSuccessModal) {
      console.error('[showOrderSuccess] Modal element not found');
      return;
    }

    console.log('[showOrderSuccess] Updating order details');
    document.getElementById('order-id-display').textContent = order.id;
    document.getElementById('delivery-minutes').textContent = 
      `${order.deliveryMinutes}-${order.deliveryMinutes + 2}`;

    const orderItemsContainer = document.getElementById('success-order-items');
    if (!orderItemsContainer) {
      console.error('[showOrderSuccess] Order items container not found');
      return;
    }

    orderItemsContainer.innerHTML = '';
    console.log('[showOrderSuccess] Clearing previous items');

    order.items.forEach(item => {
      console.log('[showOrderSuccess] Adding item:', item.id);
      const itemElement = document.createElement('div');
      itemElement.className = 'order-item-summary';
      itemElement.innerHTML = `
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-quantity">x${item.quantity}</span>
        </div>
        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      `;
      orderItemsContainer.appendChild(itemElement);
    });

    console.log('[showOrderSuccess] Updating totals');
    const subtotalElement = document.getElementById('success-subtotal');
    const deliveryElement = document.getElementById('success-delivery-fee');
    const totalElement = document.getElementById('success-total');
    
    if (!subtotalElement || !deliveryElement || !totalElement) {
      console.error('[showOrderSuccess] Total elements not found');
      return;
    }

    subtotalElement.textContent = `$${order.subtotal.toFixed(2)}`;
    deliveryElement.textContent = `$${order.deliveryFee.toFixed(2)}`;
    totalElement.textContent = `$${order.total.toFixed(2)}`;

    console.log('[showOrderSuccess] Showing modal');
    orderSuccessModal.style.display = 'block';
    resetDeliveryAnimations();
    
  } catch (error) {
    console.error('[showOrderSuccess] Error:', error);
  }
}
// Product rendering
function renderProducts(category = 'all', searchTerm = '') {
  if (!productsContainer) return;
  
  productsContainer.innerHTML = '';
  
  let productsToRender = [];
  
  if (category === 'all') {
    products.categories.forEach(cat => {
      if (cat.id === 'pharmacy') {
        cat.products.forEach(pharmacy => {
          productsToRender = [...productsToRender, ...pharmacy.medicines];
        });
      } else if (cat.id === 'restaurant') {
        cat.products.forEach(restaurant => {
          productsToRender = [...productsToRender, ...restaurant.foods];
        });
      }
    });
  } else if (category === 'medicine') {
    const categoryObj = products.categories.find(c => c.id === 'medicine');
    if (categoryObj) {
      productsToRender = categoryObj.products;
    }
  } else if (category === 'food') {
    const categoryObj = products.categories.find(c => c.id === 'restaurant');
    if (categoryObj) {
      categoryObj.products.forEach(restaurant => {
        productsToRender = [...productsToRender, ...restaurant.foods];
      });
    }
  }
  else if (category === 'pharmacy') {
    const categoryObj = products.categories.find(c => c.id === 'pharmacy');
    if (categoryObj) {
      categoryObj.products.forEach(pharmacy => {
        const pharmacyCard = document.createElement('div');
        pharmacyCard.className = 'pharmacy-card';
        pharmacyCard.innerHTML = `
          <div class="pharmacy-image-container">
            <img src="${pharmacy.medicines[0]?.image || './images/pharmacy-placeholder.jpg'}" 
                 alt="${pharmacy.name}" class="pharmacy-image">
          </div>
          <div class="pharmacy-info">
            <h3 class="pharmacy-title">${pharmacy.name}</h3>
            <h4 class="pharmacy-rating">${pharmacy.rating}★</h4>
            <div class="pharmacy-footer">
              <button class="view-pharmacy" data-id="${pharmacy.id}">
                <i class="fas fa-pills"></i>
                View Medicines
              </button>
            </div>
          </div>
        `;
        pharmacyCard.querySelector('.view-pharmacy').addEventListener('click', () => {
          renderPharmacyMedicines(pharmacy.id);
        });
        productsContainer.appendChild(pharmacyCard);
      });
      return;
    }
  }
  else if (category === 'restaurant') {
    // Show restaurant list (not their foods yet)
    const categoryObj = products.categories.find(c => c.id === 'restaurant');
    if (categoryObj) {
      // Render restaurant cards instead of food items
      categoryObj.products.forEach(restaurant => {
        const restaurantCard = document.createElement('div');
        restaurantCard.className = 'restaurant-card';
        restaurantCard.innerHTML = `
          <div class="restaurant-image-container">
            <img src="${restaurant.foods[0]?.image || './images/restaurant-placeholder.jpg'}" 
                 alt="${restaurant.name}" class="restaurant-image">
          </div>
          <div class="restaurant-info">
            <h3 class="restaurant-title">${restaurant.name}</h3>
            <h4 class="restaurant-title">${restaurant.rating}★</h3>
            <div class="restaurant-footer">
              <button class="view-restaurant" data-id="${restaurant.id}">
                <i class="fas fa-utensils"></i>
                View Menu
              </button>
            </div>
          </div>
        `;
        
        restaurantCard.querySelector('.view-restaurant').addEventListener('click', () => {
          renderRestaurantMenu(restaurant.id);
        });
        
        productsContainer.appendChild(restaurantCard);
      });
      return; // Exit early since we're rendering restaurants, not products
    }
  }
  

  // Filter by search term if provided
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    productsToRender = productsToRender.filter(product => 
      product.name.toLowerCase().includes(term) || 
      (product.description && product.description.toLowerCase().includes(term))
    );
  }
  
  if (productsToRender.length === 0) {
    productsContainer.innerHTML = `
      <div class="empty-products" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <i class="fas fa-search" style="font-size: 50px; color: #bdc3c7; margin-bottom: 15px;"></i>
        <h3>No products found</h3>
        <p>Try adjusting your search or category filter</p>
      </div>
    `;
    return;
  }
  
  productsToRender.forEach(product => {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
  });
}

function renderPharmacyMedicines(pharmacyId) {
  if (!productsContainer) return;
  
  const pharmacyCategory = products.categories.find(c => c.id === 'pharmacy');
  const pharmacy = pharmacyCategory.products.find(p => p.id === pharmacyId);
  
  if (!pharmacy) return;
  
  productsContainer.innerHTML = `
    <div class="pharmacy-header" style="grid-column: 1 / -1; display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
      <button class="btn-back-to-pharmacies">
        <i class="fas fa-arrow-left"></i> Back to Pharmacies
      </button>
      <h2>${pharmacy.name} Medicines</h2>
    </div>
  `;
  
  productsContainer.querySelector('.btn-back-to-pharmacies').addEventListener('click', () => {
    renderProducts('pharmacy');
  });
  
  pharmacy.medicines.forEach(medicine => {
    const productCard = createProductCard(medicine);
    productsContainer.appendChild(productCard);
  });
}

function renderRestaurantMenu(restaurantId) {
  if (!productsContainer) return;
  
  // Find the restaurant
  const restaurantCategory = products.categories.find(c => c.id === 'restaurant');
  const restaurant = restaurantCategory.products.find(r => r.id === restaurantId);
  
  if (!restaurant) return;
  
  // Update UI to show we're viewing a restaurant's menu
  productsContainer.innerHTML = `
    <div class="restaurant-header" style="grid-column: 1 / -1; display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
      <button class="btn-back-to-restaurants">
        <i class="fas fa-arrow-left"></i> Back to Restaurants
      </button>
      <h2>${restaurant.name} Menu</h2>
    </div>
  `;
  
  // Add back button event listener
  productsContainer.querySelector('.btn-back-to-restaurants').addEventListener('click', () => {
    renderProducts('restaurant');
  });
  
  // Render each food item
  restaurant.foods.forEach(food => {
    const productCard = createProductCard(food);
    productsContainer.appendChild(productCard);
  });
}


function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  // Determine if it's medicine or food
  const isMedicine = product.hasOwnProperty('manufacturer');
  const categoryClass = isMedicine ? 'medicine' : 'food';
  const categoryText = isMedicine ? 'Medicine' : 'Food';
  
  card.innerHTML = `
    <span class="product-badge ${categoryClass}">
      ${categoryText}
    </span>
    <div class="product-image-container">
      <img src="${product.image}" alt="${product.name}" class="product-image">
    </div>
    <div class="product-info">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-desc">${product.description}</p>
      <div class="product-footer">
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-actions">
          <button class="view-details" data-id="${product.id}">
            <i class="fas fa-info-circle"></i>
            Details
          </button>
          <button class="add-to-cart" data-id="${product.id}">
            <i class="fas fa-cart-plus"></i>
            Add
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product));
  card.querySelector('.view-details').addEventListener('click', () => showProductDetails(product, isMedicine));
  
  return card;
}

function showProductDetails(product, isMedicine) {
  const modal = document.getElementById('product-details-modal');
  const content = document.getElementById('product-details-content');
  
  let detailsHTML = `
    <div class="product-details-header">
      <div class="product-details-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-details-info">
        <h1 class="product-details-title">${product.name}</h1>
        <div class="product-details-price">$${product.price.toFixed(2)}</div>
        <span class="product-details-category">
          ${isMedicine ? 'Medicine' : 'Food'}
        </span>
        <p class="product-details-description">${product.description}</p>
        <div class="product-details-meta">
  `;
  
  // Medicine-specific fields
  if (isMedicine) {
    detailsHTML += `
          <strong>Manufacturer:</strong> ${product.manufacturer || 'N/A'}<br>
          <strong>Dosage:</strong> ${product.dosage || 'N/A'}<br>
          <strong>Expiry Date:</strong> ${product.expiry || 'N/A'}<br>
    `;
  } 
  // Food-specific fields
  else {
    detailsHTML += `
          <strong>Calories:</strong> ${product.calories || 'N/A'}<br>
          <strong>Preparation Time:</strong> ${product.preparation || 'N/A'}<br>
    `;
  }
  
  // Close the HTML structure
  detailsHTML += `
        </div>
        <div class="product-details-actions">
          <button class="add-to-cart btn-primary" data-id="${product.id}" style="padding: 12px 20px;">
            <i class="fas fa-cart-plus"></i>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
  
  content.innerHTML = detailsHTML;
  
  // Add event listener to add to cart button in modal
  content.querySelector('.add-to-cart').addEventListener('click', () => {
    addToCart(product);
    modal.style.display = 'none';
  });
  
  modal.style.display = 'flex';
}

// Cart functions
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  updateCart();
  showToast(`${product.name} added to cart`);
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  
  // If on cart page, update the display
  if (document.getElementById('cart-items')) {
    renderCartItems();
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  if (cartCountElement) cartCountElement.textContent = totalItems;
}

// Location functions
function getCurrentLocation() {
  if (navigator.geolocation) {
    showToast("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        const currentLocation = {
          type: "current",
          address: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`,
          coordinates: { lat: latitude, lng: longitude }
        };

        saveLocation(currentLocation);
      },
      (error) => {
        showToast("Error getting location: " + error.message);
      }
    );
  } else {
    showToast("Geolocation is not supported by your browser");
  }
}

function saveManualLocation() {
  const address = manualAddressInput.value.trim();
  if (address) {
    const manualLocation = {
      type: "manual",
      address: address,
      coordinates: null
    };
    
    saveLocation(manualLocation);
  } else {
    showToast("Please enter a valid address");
  }
}

function saveLocation(locationData) {
  localStorage.setItem('location', JSON.stringify(locationData));
  userLocation = locationData;
  updateLocationUI();
  showToast('Location saved successfully');
  locationModal.style.display = 'none';
  
  // Save location to user data if logged in
  if (user) {
    user.location = locationData;
    localStorage.setItem('user', JSON.stringify(user));
    saveUserData();
  }
}

function updateLocationUI() {
  if (currentLocationElement) {
    currentLocationElement.textContent = userLocation ? userLocation.address : 'Select Location';
  }
  
  if (profileAddress && userLocation) {
    profileAddress.textContent = userLocation.address;
  }
}

// Auth functions
function handleLogin(e) {
  e.preventDefault();
  const phone = document.getElementById('login-phone').value;
  const password = document.getElementById('login-password').value;
  
  // Check against registered users
  const usersData = JSON.parse(localStorage.getItem('usersData')) || {};
  const userData = usersData[phone];
  
  if (userData && userData.password === password) {
    user = userData;
    localStorage.setItem('user', JSON.stringify(user));
    updateAuthUI();
    loginModal.style.display = 'none';
    showToast('Login successful');
  } else {
    showToast('Invalid phone number or password');
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;
  
  if (username === 'admin' && password === '123') {
    isAdmin = true;
    localStorage.setItem('isAdmin', 'true');
    adminLoginModal.style.display = 'none';
    loginModal.style.display = 'none';
    showToast('Admin login successful');
    updateAuthUI();
    
    addAdminButton();
  } else {
    showToast('Invalid admin credentials');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const phone = document.getElementById('register-phone').value;
  const password = document.getElementById('register-password').value;
  const confirm = document.getElementById('register-confirm').value;
  
  if (password !== confirm) {
    showToast('Passwords do not match');
    return;
  }
  
  // Check if user already exists
  const usersData = JSON.parse(localStorage.getItem('usersData')) || {};
  if (usersData[phone]) {
    showToast('User with this phone already exists');
    return;
  }
  
  user = {
    name: name,
    phone: phone,
    password: password,
    registered: new Date().toISOString(),
    orders: []
  };
  
  // Save user to users data
  usersData[phone] = user;
  localStorage.setItem('usersData', JSON.stringify(usersData));
  localStorage.setItem('user', JSON.stringify(user));
  
  updateAuthUI();
  registerModal.style.display = 'none';
  showToast('Registration successful');
}

function logoutUser() {
  localStorage.removeItem('user');
  localStorage.removeItem('isAdmin');
  user = null;
  isAdmin = false;
  updateAuthUI();
  profileModal.style.display = 'none';
  showToast('Logged out successfully');
  
  // Remove admin button if present
  const adminBtn = document.querySelector('.btn-admin');
  if (adminBtn) {
    adminBtn.remove();
  }
  
  // Reload the page to reset the UI
  window.location.reload();
}

function updateAuthUI() {
  
  if (user || isAdmin) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (profileBtn) profileBtn.style.display = 'block';
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (registerBtn) registerBtn.style.display = 'block';
    if (profileBtn) profileBtn.style.display = 'none';
  }
}

// Profile functions
function showProfileModal() {
  updateProfileUI();
  profileModal.style.display = 'flex';
}

function showOrderHistory() {
  renderOrderHistory();
  ordersModal.style.display = 'flex';
}

function updateProfileUI() {
  if (user) {
    if (profileName) profileName.textContent = user.name;
    if (profilePhone) profilePhone.textContent = user.phone;
    
    if (profileAddress) {
      profileAddress.textContent = user.location ? user.location.address : 'No address saved';
    }
  }
}

function renderOrderHistory() {
  if (!ordersList) return;
  
  if (!user || !user.orders || user.orders.length === 0) {
    ordersList.innerHTML = `
      <div class="empty-orders">
        <i class="fas fa-history"></i>
        <h3>No orders yet</h3>
        <p>Your order history will appear here</p>
      </div>
    `;
    return;
  }
  
  ordersList.innerHTML = '';
  user.orders.forEach(order => {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    
    orderCard.innerHTML = `
      <div class="order-header">
        <span class="order-date">${new Date(order.date).toLocaleString()}</span>
        <span class="order-total">$${order.total.toFixed(2)}</span>
      </div>
      <div class="order-items">
        ${order.items.map(item => `
          <div class="order-item">
            <span class="order-item-name">${item.name} x${item.quantity}</span>
            <span class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      <div class="order-location">
        <i class="fas fa-map-marker-alt"></i>
        ${order.location ? order.location.address : "No location saved"}
      </div>
    `;
    
    ordersList.appendChild(orderCard);
  });
}

// Admin product management
function renderAdminProducts() {
  if (!adminProductsList) return;
  
  adminProductsList.innerHTML = '';
  
  products.categories.forEach(category => {
    category.products.forEach(product => {
      const productItem = document.createElement('div');
      productItem.className = 'admin-product-item';
      productItem.innerHTML = `
        <div class="admin-product-info">
          <img src="${product.image}" alt="${product.name}" class="admin-product-image">
          <div>
            <div class="admin-product-name">${product.name}</div>
            <div class="admin-product-price">$${product.price.toFixed(2)}</div>
          </div>
        </div>
        <div class="admin-product-actions">
          <button class="btn-edit" data-id="${product.id}" data-category="${category.id}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn-delete" data-id="${product.id}" data-category="${category.id}">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      `;
      
      adminProductsList.appendChild(productItem);
      
      // Add event listeners
      productItem.querySelector('.btn-edit').addEventListener('click', () => {
        editProduct(product.id, category.id);
      });
      
      productItem.querySelector('.btn-delete').addEventListener('click', () => {
        deleteProduct(product.id, category.id);
      });
    });
  });
}

function showCategoryFields() {
  const category = productCategorySelect.value;
  categorySpecificFields.innerHTML = '';
  
  if (category === 'medicine') {
    categorySpecificFields.innerHTML = `
      <div class="form-group">
        <label for="product-pharmacyr">Pharmacy</label>
        <input type="text" id="product-pharmacy" placeholder="Enter Pharmacy" required>
      </div>
      <div class="form-group">
        <label for="product-manufacturer">Manufacturer</label>
        <input type="text" id="product-manufacturer" placeholder="Enter manufacturer" required>
      </div>
      <div class="form-group">
        <label for="product-dosage">Dosage</label>
        <input type="text" id="product-dosage" placeholder="Enter dosage instructions" required>
      </div>
      <div class="form-group">
        <label for="product-expiry">Expiry Date</label>
        <input type="text" id="product-expiry" placeholder="Enter expiry date (MM/YYYY)" required>
      </div>
    `;
  } else if (category === 'food') {
    categorySpecificFields.innerHTML = `
      <div class="form-group">
        <label for="product-restaurant">Restaurant</label>
        <input type="text" id="product-restaurant" placeholder="Enter restaurant name" required>
      </div>
      <div class="form-group">
        <label for="product-calories">Calories</label>
        <input type="text" id="product-calories" placeholder="Enter calorie count" required>
      </div>
      <div class="form-group">
        <label for="product-preparation">Preparation Time</label>
        <input type="text" id="product-preparation" placeholder="Enter preparation time" required>
      </div>
    `;
  }
}

function editProduct(productId, categoryId) {
  const category = products.categories.find(c => c.id === categoryId);
  const product = category.products.find(p => p.id === productId);
  
  if (!product) return;
  
  // Fill the form with product data
  document.getElementById('product-form-title').textContent = 'Edit Product';
  document.getElementById('product-id').value = productId;
  document.getElementById('product-category').value = categoryId;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-image').value = product.image;
  
  // Show category-specific fields
  showCategoryFields();
  
  // Fill category-specific fields
  if (categoryId === 'medicine') {
    document.getElementById('product-pharmacy').value;
    document.getElementById('product-manufacturer').value = product.manufacturer;
    document.getElementById('product-dosage').value = product.dosage;
    document.getElementById('product-expiry').value = product.expiry;
  } else if (categoryId === 'food') {
    document.getElementById('product-restaurant').value = product.restaurant;
    document.getElementById('product-calories').value = product.calories;
    document.getElementById('product-preparation').value = product.preparation;
  }
  
  productFormModal.style.display = 'flex';
}

function deleteProduct(productId, categoryId) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  const category = products.categories.find(c => c.id === categoryId);
  category.products = category.products.filter(p => p.id !== productId);
  
  // Update localStorage
  localStorage.setItem('products', JSON.stringify(products));
  
  // Re-render products
  renderAdminProducts();
  
  // If on main page, re-render products there too
  if (productsContainer) {
    const activeCategory = document.querySelector('.category-item.active')?.getAttribute('data-category') || 'all';
    renderProducts(activeCategory, searchInput?.value);
  }
  
  showToast('Product deleted successfully');
}

function handleProductFormSubmit(e) {
  e.preventDefault();
  
  const productId = document.getElementById('product-id').value;
  const categoryId = document.getElementById('product-category').value;
  const name = document.getElementById('product-name').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const description = document.getElementById('product-description').value;
  const image = document.getElementById('product-image').value;
  
  const category = products.categories.find(c => c.id === categoryId);
  
  // Get category-specific fields
  let categoryFields = {};
  if (categoryId === 'medicine') {
    categoryFields = {
      pharmacy: document.getElementById('product-pharmacy').value,
      manufacturer: document.getElementById('product-manufacturer').value,
      dosage: document.getElementById('product-dosage').value,
      expiry: document.getElementById('product-expiry').value
    };
  } else if (categoryId === 'food') {
    categoryFields = {
      restaurant: document.getElementById('product-restaurant').value,
      calories: document.getElementById('product-calories').value,
      preparation: document.getElementById('product-preparation').value
    };
  }
  
  if (productId) {
    // Editing existing product
    const product = category.products.find(p => p.id === productId);
    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      Object.assign(product, categoryFields);
    }
  } else {
    // Adding new product
    const newProduct = {
      id: `${categoryId.substring(0,1)}${Date.now().toString().slice(-4)}`,
      name,
      price,
      description,
      image,
      category: categoryId,
      ...categoryFields
    };
    
    category.products.push(newProduct);
  }
  
  // Update localStorage
  localStorage.setItem('products', JSON.stringify(products));
  
  // Close modal and re-render
  productFormModal.style.display = 'none';
  renderAdminProducts();
  
  // If on main page, re-render products there too
  if (productsContainer) {
    const activeCategory = document.querySelector('.category-item.active')?.getAttribute('data-category') || 'all';
    renderProducts(activeCategory, searchInput?.value);
  }
  
  showToast(`Product ${productId ? 'updated' : 'added'} successfully`);
}

// Utility functions
function saveUserData() {
  if (!user) return;
  
  // Get all users data
  const usersData = JSON.parse(localStorage.getItem('usersData')) || {};
  
  // Update current user
  usersData[user.phone] = user;
  localStorage.setItem('usersData', JSON.stringify(usersData));
  
  showToast('User data saved');
}

function showToast(message) {
  if (!toast || !toastMessage) return;
  
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);