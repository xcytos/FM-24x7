// ui-handlers.js

// ====================
// Event Listeners Setup
// ====================
function setupEventListeners() {
  try {
    // Category Selection
    if (categoryItems) {
      categoryItems.forEach(item => {
        item.addEventListener('click', () => {
          categoryItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          renderProducts(item.dataset.category, searchInput?.value);
        });
      });
    }

    // Search Functionality
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const activeCategory = document.querySelector('.category-item.active')?.dataset.category || 'all';
        renderProducts(activeCategory, searchInput.value);
      });
    }

    // Cart Button
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        window.location.href = 'cart.html';
      });
    }

    // Location Management
    if (locationSelector) locationSelector.addEventListener('click', () => locationModal.style.display = 'flex');
    if (currentLocationOption) currentLocationOption.addEventListener("click", getCurrentLocation);
    if (saveAddressBtn) saveAddressBtn.addEventListener("click", saveManualLocation);

    // Authentication
    if (loginBtn) loginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
    if (adminLoginBtn) adminLoginBtn.addEventListener('click', () => {
      if (loginModal) loginModal.style.display = 'none';
      if (adminLoginModal) adminLoginModal.style.display = 'flex';
    });
    if (registerBtn) registerBtn.addEventListener('click', () => registerModal.style.display = 'flex');
    if (profileBtn) profileBtn.addEventListener('click', showProfileModal);
    if (orderHistoryBtn) orderHistoryBtn.addEventListener('click', showOrderHistory);
    if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);

    // Forms
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (adminLoginForm) adminLoginForm.addEventListener('submit', handleAdminLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    // Admin Product Management
    if (addProductBtn) {
      addProductBtn.addEventListener('click', () => {
        productForm.reset();
        productFormModal.style.display = 'flex';
      });
    }
    if (productCategorySelect) productCategorySelect.addEventListener('change', showCategoryFields);
    if (productForm) productForm.addEventListener('submit', handleProductFormSubmit);

    // Modals
    closeModalButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
          if (modal) modal.style.display = 'none';
        });
      });
    });

    document.querySelectorAll('.modal').forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.style.display = 'none';
        });
      }
    });

    if (closeDeliveryNotification) {
      closeDeliveryNotification.addEventListener('click', hideDeliveryNotification);
    }

    // Storage Sync
    window.addEventListener('storage', () => {
      loadState();
      updateUI();
      if (document.getElementById('cart-items')) renderCartItems();
    });

  } catch (error) {
    console.error('Event listener setup failed:', error);
  }
}

// ======================
// Product UI Management
// ======================
function renderProducts(category = 'all', searchTerm = '') {
  try {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';
    
    let productsToRender = [];
    
    if (category === 'all') {
      products.categories.forEach(cat => {
        if (cat.id === 'pharmacy') cat.products.forEach(p => productsToRender.push(...p.medicines));
        if (cat.id === 'restaurant') cat.products.forEach(r => productsToRender.push(...r.foods));
      });
    } else if (category === 'pharmacy') {
      const categoryObj = products.categories.find(c => c.id === 'pharmacy');
      if (categoryObj) {
        categoryObj.products.forEach(pharmacy => {
          const pharmacyCard = document.createElement('div');
          pharmacyCard.className = 'pharmacy-card';
          pharmacyCard.innerHTML = `
            <div class="pharmacy-image-container">
              <img src="${pharmacy.image || './images/pharmacy-placeholder.jpg'}" 
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
          pharmacyCard.querySelector('.view-pharmacy').addEventListener('click', () => 
            renderPharmacyMedicines(pharmacy.id));
          productsContainer.appendChild(pharmacyCard);
        });
        return;
      }
    } else if (category === 'restaurant') {
      const categoryObj = products.categories.find(c => c.id === 'restaurant');
      if (categoryObj) {
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
              <h4 class="restaurant-rating">${restaurant.rating}★</h4>
              <div class="restaurant-footer">
                <button class="view-restaurant" data-id="${restaurant.id}">
                  <i class="fas fa-utensils"></i>
                  View Menu
                </button>
              </div>
            </div>
          `;
          restaurantCard.querySelector('.view-restaurant').addEventListener('click', () => 
            renderRestaurantMenu(restaurant.id));
          productsContainer.appendChild(restaurantCard);
        });
        return;
      }
    }

    // Search Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      productsToRender = productsToRender.filter(product => 
        product.name.toLowerCase().includes(term) || 
        (product.description?.toLowerCase().includes(term))
      );
    }

    // Empty State
    if (!productsToRender.length) {
      productsContainer.innerHTML = `
        <div class="empty-products">
          <i class="fas fa-search"></i>
          <h3>No products found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      `;
      return;
    }

    // Render Products
    productsToRender.forEach(product => {
      productsContainer.appendChild(createProductCard(product));
    });

  } catch (error) {
    console.error('Product rendering failed:', error);
  }
}

function createProductCard(product) {
  try {
    const card = document.createElement('div');
    card.className = 'product-card';
    const isMedicine = 'manufacturer' in product;
    
    card.innerHTML = `
      <span class="product-badge ${isMedicine ? 'medicine' : 'food'}">
        ${isMedicine ? 'Medicine' : 'Food'}
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
              <i class="fas fa-info-circle"></i> Details
            </button>
            <button class="add-to-cart" data-id="${product.id}">
              <i class="fas fa-cart-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `;

    card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product));
    card.querySelector('.view-details').addEventListener('click', () => 
      showProductDetails(product, isMedicine));
    
    return card;
  } catch (error) {
    console.error('Product card creation failed:', error);
    return document.createElement('div');
  }
}

function showProductDetails(product, isMedicine) {
  try {
    const modal = document.getElementById('product-details-modal');
    const content = document.getElementById('product-details-content');
    if (!modal || !content) return;

    let detailsHTML = `
      <div class="product-details-header">
        <div class="product-details-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-details-info">
          <h1 class="product-details-title">${product.name}</h1>
          <div class="product-details-price">$${product.price.toFixed(2)}</div>
          <span class="product-details-category">${isMedicine ? 'Medicine' : 'Food'}</span>
          <p class="product-details-description">${product.description}</p>
          <div class="product-details-meta">`;

    if (isMedicine) {
      detailsHTML += `
            <strong>Manufacturer:</strong> ${product.manufacturer || 'N/A'}<br>
            <strong>Dosage:</strong> ${product.dosage || 'N/A'}<br>
            <strong>Expiry Date:</strong> ${product.expiry || 'N/A'}<br>`;
    } else {
      detailsHTML += `
            <strong>Calories:</strong> ${product.calories || 'N/A'}<br>
            <strong>Preparation Time:</strong> ${product.preparation || 'N/A'}<br>`;
    }

    detailsHTML += `
          </div>
          <div class="product-details-actions">
            <button class="add-to-cart btn-primary" data-id="${product.id}">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>`;

    content.innerHTML = detailsHTML;
    content.querySelector('.add-to-cart').addEventListener('click', () => {
      addToCart(product);
      modal.style.display = 'none';
    });
    modal.style.display = 'flex';
  } catch (error) {
    console.error('Product details failed:', error);
  }
}

function renderPharmacyMedicines(pharmacyId) {
  try {
    if (!productsContainer) return;
    const pharmacyCategory = products.categories.find(c => c.id === 'pharmacy');
    const pharmacy = pharmacyCategory.products.find(p => p.id === pharmacyId);
    if (!pharmacy) return;
    
    productsContainer.innerHTML = `
      <div class="pharmacy-header">
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
      productsContainer.appendChild(createProductCard(medicine));
    });
  } catch (error) {
    console.error('Pharmacy medicines rendering failed:', error);
  }
}

function renderRestaurantMenu(restaurantId) {
  try {
    if (!productsContainer) return;
    const restaurantCategory = products.categories.find(c => c.id === 'restaurant');
    const restaurant = restaurantCategory.products.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    productsContainer.innerHTML = `
      <div class="restaurant-header">
        <button class="btn-back-to-restaurants">
          <i class="fas fa-arrow-left"></i> Back to Restaurants
        </button>
        <h2>${restaurant.name} Menu</h2>
      </div>
    `;
    
    productsContainer.querySelector('.btn-back-to-restaurants').addEventListener('click', () => {
      renderProducts('restaurant');
    });
    
    restaurant.foods.forEach(food => {
      productsContainer.appendChild(createProductCard(food));
    });
  } catch (error) {
    console.error('Restaurant menu rendering failed:', error);
  }
}

// ==================
// Cart UI Management
// ==================
function initCartPage() {

  try {
    renderCartItems();
    setupCartEventListeners();
  } catch (error) {
    console.error('Cart page initialization failed:', error);
  }
}

function renderCartItems() {
  try {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started</p>
        </div>`;
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
        </div>`;
      cartItemsContainer.appendChild(cartItem);
    });
    
    updateCartTotals();
  } catch (error) {
    console.error('Cart items rendering failed:', error);
  }
}

function setupCartEventListeners() {
  try {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', checkout);
    }

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('minus')) {
        updateQuantity(e.target.dataset.id, -1);
      } else if (e.target.classList.contains('plus')) {
        updateQuantity(e.target.dataset.id, 1);
      } else if (e.target.classList.contains('remove-item')) {
        removeFromCart(e.target.dataset.id);
      }
    });

    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('quantity')) {
        setQuantity(e.target.dataset.id, parseInt(e.target.value) || 1);
      }
    });
  } catch (error) {
    console.error('Cart event listeners failed:', error);
  }
}

function updateQuantity(productId, change) {
  try {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      updateCart();
    }
  } catch (error) {
    console.error('Quantity update failed:', error);
  }
}

function setQuantity(productId, quantity) {
  try {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    if (quantity < 1) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      updateCart();
    }
  } catch (error) {
    console.error('Set quantity failed:', error);
  }
}

function removeFromCart(productId) {
  try {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showToast('Item removed from cart');
  } catch (error) {
    console.error('Remove from cart failed:', error);
  }
}

function updateCartTotals() {
  try {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const total = subtotal + deliveryFee;
    
    if (document.getElementById('cart-subtotal')) {
      document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    }
    if (document.getElementById('delivery-fee')) {
      document.getElementById('delivery-fee').textContent = `$${deliveryFee.toFixed(2)}`;
    }
    if (document.getElementById('cart-total')) {
      document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }
  } catch (error) {
    console.error('Cart totals update failed:', error);
  }
}

// =====================
// Authentication Handlers
// =====================
function handleLogin(e) {
  localStorage.removeItem(STATE_KEYS.CART);
  try {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    const usersData = JSON.parse(localStorage.getItem('usersData')) || {};
    const userData = usersData[phone];

    if (userData && userData.password === password) {
      user = userData;
      localStorage.setItem(STATE_KEYS.USER, JSON.stringify(user));
      updateUI();
      loginModal.style.display = 'none';
      showToast('Login successful');
    } else {
      showToast('Invalid phone number or password');
    }
  } catch (error) {
    console.error('Login failed:', error);
    showToast('Login failed');
  }
}

function handleAdminLogin(e) {
  try {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === 'admin' && password === '123') {
      isAdmin = true;
      localStorage.setItem(STATE_KEYS.IS_ADMIN, 'true');
      adminLoginModal.style.display = 'none';
      loginModal.style.display = 'none';
      showToast('Admin login successful');
      updateUI();
      addAdminButton();
    } else {
      showToast('Invalid admin credentials');
    }
  } catch (error) {
    console.error('Admin login failed:', error);
    showToast('Admin login failed');
  }
}

function handleRegister(e) {
  try {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (password !== confirm) {
      showToast('Passwords do not match');
      return;
    }

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

    usersData[phone] = user;
    localStorage.setItem('usersData', JSON.stringify(usersData));
    localStorage.setItem(STATE_KEYS.USER, JSON.stringify(user));
    updateUI();
    registerModal.style.display = 'none';
    showToast('Registration successful');
  } catch (error) {
    console.error('Registration failed:', error);
    showToast('Registration failed');
  }
}

function logoutUser() {
  try {
    localStorage.removeItem(STATE_KEYS.USER);
    localStorage.removeItem(STATE_KEYS.IS_ADMIN);
    user = null;
    isAdmin = false;
    updateUI();
    if (profileModal) profileModal.style.display = 'none';
    showToast('Logged out successfully');
    
    const adminBtn = document.querySelector('.btn-admin');
    if (adminBtn) adminBtn.remove();
    window.location.reload();
  } catch (error) {
    console.error('Logout failed:', error);
    showToast('Logout failed');
  }
}

function showProfileModal() {
  try {
    updateProfileUI();
    if (profileModal) profileModal.style.display = 'flex';
  } catch (error) {
    console.error('Profile modal failed:', error);
  }
}

function updateProfileUI() {
  try {
    if (user) {
      if (profileName) profileName.textContent = user.name;
      if (profilePhone) profilePhone.textContent = user.phone;
      if (profileAddress) profileAddress.textContent = user.location?.address || 'No address saved';
    }
  } catch (error) {
    console.error('Profile UI update failed:', error);
  }
}

function showOrderHistory() {
  try {
    renderOrderHistory();
    if (ordersModal) ordersModal.style.display = 'flex';
  } catch (error) {
    console.error('Order history failed:', error);
  }
}

function renderOrderHistory() {
  try {
    if (!ordersList) return;
    ordersList.innerHTML = '';
    
    if (!user?.orders?.length) {
      ordersList.innerHTML = `
        <div class="empty-orders">
          <i class="fas fa-history"></i>
          <h3>No orders yet</h3>
          <p>Your order history will appear here</p>
        </div>
      `;
      return;
    }
    
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
          ${order.location?.address || "No location saved"}
        </div>
      `;
      ordersList.appendChild(orderCard);
    });
  } catch (error) {
    console.error('Order history rendering failed:', error);
  }
}

//admin

function initAdmin() {
  if (!isAdmin) return;
  
  // Add admin button to header if not already present
  addAdminButton();
  
  // Set up admin event listeners
  setupAdminEventListeners();
}
// =====================
// Admin UI Management
// =====================
function renderAdminProducts() {
  try {
    if (!adminProductsList) return;
    adminProductsList.innerHTML = '';

    products.categories.forEach(category => {
      category.products.forEach(parent => {
        let productList = [];

        // Handle different product types
        if (category.id === 'pharmacy') {
          productList = parent.medicines || [];
        } else if (category.id === 'restaurant') {
          productList = parent.foods || [];
        } else {
          productList = [parent]; // In case of flat structure
        }

        productList.forEach(product => {
          const safePrice = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';

          const productItem = document.createElement('div');
          productItem.className = 'admin-product-item';
          productItem.innerHTML = `
            <div class="admin-product-info">
              <img src="${product.image || './images/placeholder.jpg'}" alt="${product.name || 'Unnamed'}" class="admin-product-image">
              <div>
                <div class="admin-product-name">${product.name || 'Unnamed Product'}</div>
                <div class="admin-product-price">$${safePrice}</div>
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

          productItem.querySelector('.btn-edit').addEventListener('click', () =>
            editProduct(product.id, category.id));
          productItem.querySelector('.btn-delete').addEventListener('click', () =>
            deleteProduct(product.id, category.id));

          adminProductsList.appendChild(productItem);
        });
      });
    });
  } catch (error) {
    console.error('Admin products rendering failed:', error);
  }
}

/**
 * Creates a product card for admin view
 */
function createAdminProductCard(product, categoryType, parentName) {
  const card = document.createElement('div');
  card.className = 'admin-product-card';
  
  const price = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';
  const image = product.image || './images/placeholder.jpg';
  
  card.innerHTML = `
    <div class="admin-product-image-container">
      <img src="${image}" alt="${product.name}" onerror="this.src='./images/placeholder.jpg'">
    </div>
    <div class="admin-product-info">
      <h4>${product.name}</h4>
      <div class="admin-product-meta">
        <span class="price">$${price}</span>
        <span class="parent">${parentName}</span>
        <span class="id">ID: ${product.id}</span>
      </div>
    </div>
    <div class="admin-product-actions">
      <button class="btn-edit" data-id="${product.id}" data-category="${categoryType}">
        <i class="fas fa-edit"></i> Edit
      </button>
      <button class="btn-delete" data-id="${product.id}" data-category="${categoryType}">
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>
  `;
  
  // Add event listeners
  card.querySelector('.btn-edit').addEventListener('click', () => 
    editProduct(product.id, categoryType));
  card.querySelector('.btn-delete').addEventListener('click', () => 
    confirmDelete(product.id, categoryType));
  
  return card;
}

/**
 * Shows category-specific fields in product form
 */
function showCategoryFields() {
  try {
    if (!productCategorySelect || !categorySpecificFields) return;
    
    const category = productCategorySelect.value;
    categorySpecificFields.innerHTML = '';
    
    const fields = {
      medicine: `
        <div class="form-row">
          <div class="form-group">
            <label for="product-manufacturer">Manufacturer</label>
            <input type="text" id="product-manufacturer" required>
          </div>
          <div class="form-group">
            <label for="product-dosage">Dosage</label>
            <input type="text" id="product-dosage" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="product-expiry">Expiry Date</label>
            <input type="date" id="product-expiry" required>
          </div>
        </div>
      `,
      food: `
        <div class="form-row">
          <div class="form-group">
            <label for="product-calories">Calories</label>
            <input type="number" id="product-calories" min="0" required>
          </div>
          <div class="form-group">
            <label for="product-preparation">Prep Time (mins)</label>
            <input type="number" id="product-preparation" min="1" required>
          </div>
        </div>
      `
    };

    if (fields[category]) {
      categorySpecificFields.innerHTML = fields[category];
    }
  } catch (error) {
    console.error('Category fields failed:', error);
    showToast('Failed to load category fields', 'error');
  }
}

/**
 * Resets the product form for new entries
 */
function resetProductForm() {
  productForm.reset();
  document.getElementById('product-id').value = '';
  categorySpecificFields.innerHTML = '';
}

/**
 * Handles product form submission
 */
function handleProductFormSubmit(e) {
  try {
    e.preventDefault();
    
    if (!validateProductForm()) return;
    
    const productData = getProductFormData();
    saveProduct(productData);
    
    productFormModal.style.display = 'none';
    renderAdminProducts();
    renderProducts(); // Refresh customer view
    
    showToast(`Product ${productData.id ? 'updated' : 'added'} successfully`, 'success');
  } catch (error) {
    console.error('Product form submission failed:', error);
    showToast('Failed to save product', 'error');
  }
}

/**
 * Validates the product form
 */
function validateProductForm() {
  const requiredFields = ['product-name', 'product-price', 'product-category'];
  let isValid = true;
  
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field || !field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    } else {
      field.classList.remove('error');
    }
  });
  
  // Validate price
  const priceField = document.getElementById('product-price');
  if (priceField && (isNaN(parseFloat(priceField.value)) || parseFloat(priceField.value) <= 0)) {
    priceField.classList.add('error');
    isValid = false;
  }
  
  if (!isValid) {
    showToast('Please fill all required fields correctly', 'error');
  }
  
  return isValid;
}

/**
 * Gets form data and structures it for saving
 */
function getProductFormData() {
  const category = productCategorySelect.value;
  const productId = document.getElementById('product-id').value || generateProductId(category);
  
  const productData = {
    id: productId,
    name: document.getElementById('product-name').value.trim(),
    price: parseFloat(document.getElementById('product-price').value),
    description: document.getElementById('product-description').value.trim(),
    image: document.getElementById('product-image').value.trim() || './images/placeholder.jpg',
    category: category
  };
  
  // Add category-specific fields
  if (category === 'medicine') {
    productData.manufacturer = document.getElementById('product-manufacturer').value.trim();
    productData.dosage = document.getElementById('product-dosage').value.trim();
    productData.expiry = document.getElementById('product-expiry').value;
  } 
  else if (category === 'food') {
    productData.calories = parseInt(document.getElementById('product-calories').value);
    productData.preparation = parseInt(document.getElementById('product-preparation').value) + ' mins';
  }
  
  return productData;
}

/**
 * Generates a product ID based on category
 */
function generateProductId(category) {
  const prefix = category === 'medicine' ? 'med' : 'food';
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

/**
 * Saves product to the appropriate category structure
 */
function saveProduct(productData) {
  // Convert form category to data category
  const dataCategory = CATEGORY_MAPPING.formToData[productData.category] || productData.category;
  
  const category = products.categories.find(c => c.id === dataCategory);
  if (!category) throw new Error(`Category ${dataCategory} not found`);
  
  // Find the parent (pharmacy/restaurant)
  const parent = category.products[0]; // Using first parent as per your data structure
  if (!parent) throw new Error(`No parent found in ${dataCategory} category`);
  
  const productsArray = dataCategory === 'pharmacy' ? parent.medicines : parent.foods;
  
  // Check if editing existing product
  const existingIndex = productsArray.findIndex(p => p.id === productData.id);
  if (existingIndex >= 0) {
    productsArray[existingIndex] = productData;
  } else {
    productsArray.push(productData);
  }
  
  // Save to localStorage
  localStorage.setItem('products', JSON.stringify(products));
}
 //* Loads product data into form for editing
 //*/
function editProduct(productId, dataCategory) {
  try {
    // Convert data category to form category
    const formCategory = CATEGORY_MAPPING.dataToForm[dataCategory] || dataCategory;
    
    const product = findProductById(productId, dataCategory);
    if (!product) throw new Error('Product not found');
    
    resetProductForm();
    document.getElementById('product-form-title').textContent = 'Edit Product';
    
    // Fill basic fields
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name || '';
    document.getElementById('product-price').value = product.price || '';
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-image').value = product.image || '';
    document.getElementById('product-category').value = formCategory;
    
    // Show category-specific fields
    showCategoryFields();
    
    // Fill category-specific fields
    if (dataCategory === 'pharmacy') {
      document.getElementById('product-manufacturer').value = product.manufacturer || '';
      document.getElementById('product-dosage').value = product.dosage || '';
      document.getElementById('product-expiry').value = product.expiry || '';
    } else if (dataCategory === 'restaurant') {
      const calories = product.calories?.replace(' kcal', '') || '';
      const prepTime = product.preparation?.replace(' mins', '') || '';
      document.getElementById('product-calories').value = calories;
      document.getElementById('product-preparation').value = prepTime;
    }
    
    productFormModal.style.display = 'flex';
  } catch (error) {
    console.error('Edit product failed:', error);
    showToast('Failed to load product for editing', 'error');
  }
}

/**
 * Finds a product by ID in the data structure
 */
function findProductById(productId, dataCategory) {
  const category = products.categories.find(c => c.id === dataCategory);
  if (!category) return null;
  
  for (const parent of category.products) {
    const productsArray = dataCategory === 'pharmacy' ? parent.medicines : parent.foods;
    const product = productsArray?.find(p => p.id === productId);
    if (product) return product;
  }
  
  return null;
}
/**
 * Confirms and handles product deletion
 */
function confirmDelete(productId, categoryType) {
  const product = findProductById(productId, categoryType);
  if (!product) return;
  
  const confirmation = confirm(`Delete "${product.name}"? This cannot be undone.`);
  if (confirmation) {
    deleteProduct(productId, categoryType);
  }
}

/**
 * Deletes a product from the data structure
 */
function deleteProduct(productId, categoryType) {
  try {
    const category = products.categories.find(c => c.id === categoryType);
    if (!category) throw new Error('Category not found');
    
    let deleted = false;
    
    category.products.forEach(parent => {
      const productsArray = categoryType === 'pharmacy' ? parent.medicines : parent.foods;
      const index = productsArray?.findIndex(p => p.id === productId) ?? -1;
      
      if (index >= 0) {
        productsArray.splice(index, 1);
        deleted = true;
      }
    });
    
    if (!deleted) throw new Error('Product not found');
    
    localStorage.setItem('products', JSON.stringify(products));
    renderAdminProducts();
    renderProducts(); // Refresh customer view
    
    showToast('Product deleted successfully', 'success');
  } catch (error) {
    console.error('Delete product failed:', error);
    showToast('Failed to delete product', 'error');
  }
}


// =====================
// Location Management
// =====================
function getCurrentLocation() {
  try {
    if (navigator.geolocation) {
      showToast("Getting your location...");
      navigator.geolocation.getCurrentPosition(
        position => {
          const location = {
            type: "current",
            address: `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}`,
            coordinates: { 
              lat: position.coords.latitude, 
              lng: position.coords.longitude 
            }
          };
          saveLocation(location);
        },
        error => showToast("Location error: " + error.message)
      );
    } else {
      showToast("Geolocation not supported");
    }
  } catch (error) {
    console.error('Current location failed:', error);
    showToast('Location detection failed');
  }
}

function saveManualLocation() {
  try {
    const address = manualAddressInput?.value.trim();
    if (!address) {
      showToast("Please enter a valid address");
      return;
    }
    saveLocation({
      type: "manual",
      address: address,
      coordinates: null
    });
  } catch (error) {
    console.error('Manual location save failed:', error);
    showToast('Address save failed');
  }
}

function saveLocation(locationData) {
  try {
    localStorage.setItem(STATE_KEYS.LOCATION, JSON.stringify(locationData));
    userLocation = locationData;
    updateLocationUI();
    showToast('Location saved successfully');
    if (locationModal) locationModal.style.display = 'none';
    
    if (user) {
      user.location = locationData;
      localStorage.setItem(STATE_KEYS.USER, JSON.stringify(user));
    }
  } catch (error) {
    console.error('Location save failed:', error);
    showToast('Location save failed');
  }
}

// =====================
// Order Management
// =====================
function showOrderSuccess(order) {
  
  try {
    if (!orderSuccessModal || !order) {
      console.error('Modal or order data missing');
      return;
    }

    // Set order ID
    const orderIdElement = document.getElementById('order-id-display');
    if (orderIdElement) {
      orderIdElement.textContent = order.id || 'N/A';
    }

    // Set delivery time
    const deliveryTimeElement = document.getElementById('delivery-minutes');
    if (deliveryTimeElement) {
      const minutes = order.deliveryMinutes || 10;
      deliveryTimeElement.textContent = `${minutes}-${minutes + 2}`;
    }

    // Display order items
    const orderItemsContainer = document.getElementById('success-order-items');
    if (orderItemsContainer) {
      orderItemsContainer.innerHTML = '';
      
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 0;
          
          const itemElement = document.createElement('div');
          itemElement.className = 'order-item-summary';
          itemElement.innerHTML = `
            <div class="item-info">
              <span class="item-name">${item.name || 'Unknown Item'}</span>
              <span class="item-quantity">x${quantity}</span>
            </div>
            <div class="item-price">₹${(price * quantity).toFixed(2)}</div>
          `;
          orderItemsContainer.appendChild(itemElement);
        });
      }
    }

    // Set amounts - changed all $ to ₹
    const setAmount = (elementId, value) => {
      const element = document.getElementById(elementId);
      if (element) {
        const numValue = parseFloat(value) || 0;
        element.textContent = `₹${numValue.toFixed(2)}`;
      }
    };

    setAmount('success-subtotal', order.subtotal);
    setAmount('success-delivery-fee', order.deliveryFee);
    setAmount('success-total', order.total);

    orderSuccessModal.style.display = 'block';
    resetDeliveryAnimations();
  } catch (error) {
    console.error('Order success display failed:', error);
    // Optional: Show error to user
    showToast('Failed to display order details');
  }
}

// =====================
// Delivery Notification
// =====================
function showDeliveryNotification(minutes) {
  try {
    if (!deliveryNotification || !deliveryTimeDisplay) return;
    
    if (window.deliveryNotificationTimeout) {
      clearTimeout(window.deliveryNotificationTimeout);
    }
    
    deliveryTimeDisplay.textContent = minutes;
    deliveryNotification.style.display = 'flex';
    deliveryNotification.style.animation = 'slideIn 0.5s ease-out';
    
    window.deliveryNotificationTimeout = setTimeout(() => {
      hideDeliveryNotification();
    }, 300000);
  } catch (error) {
    console.error('Delivery notification failed:', error);
  }
}

function hideDeliveryNotification() {
  try {
    if (!deliveryNotification) return;
    
    deliveryNotification.style.animation = 'slideOut 0.5s ease-out';
    
    setTimeout(() => {
      if (deliveryNotification) deliveryNotification.style.display = 'none';
    }, 500);
  } catch (error) {
    console.error('Hide notification failed:', error);
  }
}


function resetDeliveryAnimations() {
  try {
    const progressFill = document.querySelector('.progress-fill');
    const deliveryBike = document.querySelector('.delivery-bike');

    if (progressFill) {
      progressFill.style.animation = 'none';
      void progressFill.offsetWidth;
      progressFill.style.animation = 'fillProgress 4s linear forwards';
    }

    if (deliveryBike) {
      deliveryBike.style.animation = 'none';
      void deliveryBike.offsetWidth;
      deliveryBike.style.animation = 'moveBike 4s linear forwards';
    }
  } catch (error) {
    console.error('Animation reset failed:', error);
  }
}


