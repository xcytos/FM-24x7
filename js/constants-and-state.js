// constants-and-state.js
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

// Application State
const STATE_KEYS = {
  USER: 'fm_user',
  CART: 'fm_cart',
  LOCATION: 'fm_location',
  IS_ADMIN: 'fm_isAdmin',
  DELIVERY_NOTIFICATION: 'fm_deliveryNotification'
};

// Add this to your constants-and-state.js or a similar configuration file
const CATEGORY_MAPPING = {
  formToData: {
    medicine: 'pharmacy',
    food: 'restaurant'
  },
  dataToForm: {
    pharmacy: 'medicine',
    restaurant: 'food'
  }
};

let cart = JSON.parse(localStorage.getItem(STATE_KEYS.CART)) || [];
let user = JSON.parse(localStorage.getItem(STATE_KEYS.USER)) || null;
let userLocation = JSON.parse(localStorage.getItem(STATE_KEYS.LOCATION)) || null;
let isAdmin = localStorage.getItem(STATE_KEYS.IS_ADMIN) === 'true';
let products = JSON.parse(localStorage.getItem('products')) || productsData;

// Core Functions
function loadState() {
  try {
    user = JSON.parse(localStorage.getItem(STATE_KEYS.USER)) || null;
    cart = JSON.parse(localStorage.getItem(STATE_KEYS.CART)) || [];
    userLocation = JSON.parse(localStorage.getItem(STATE_KEYS.LOCATION)) || null;
    isAdmin = localStorage.getItem(STATE_KEYS.IS_ADMIN) === 'true';
  } catch (error) {
    console.error('Failed to load state:', error);
  }
}

function updateCartUI() {
  try {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountElement) cartCountElement.textContent = totalItems;
  } catch (error) {
    console.error('Cart UI update failed:', error);
  }
}

function updateLocationUI() {
  try {
    if (currentLocationElement) {
      currentLocationElement.textContent = userLocation?.address || 'Select Location';
    }
    if (profileAddress && userLocation) {
      profileAddress.textContent = userLocation.address;
    }
  } catch (error) {
    console.error('Location UI update failed:', error);
  }
}

function validateToast() {
  try {
    return !!toast && !!toastMessage;
  } catch {
    return false;
  }
}

function addAdminButton() {
  try {
    if (!document.querySelector('.btn-admin')) {
      const adminBtn = document.createElement('button');
      adminBtn.className = 'btn btn-admin';
      adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin';
      adminBtn.onclick = () => {
        adminProductModal.style.display = 'flex';
        renderAdminProducts();
      };
      document.querySelector('.header-actions').prepend(adminBtn);
    }
  } catch (error) {
    console.error('Failed to add admin button:', error);
  }
}

function addToCart(product) {
  try {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem(STATE_KEYS.CART, JSON.stringify(cart));
    updateCartUI();
    showToast(`${product.name} added to cart`);
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
}