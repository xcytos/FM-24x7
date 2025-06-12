// Initialization
function init() {
  try {
    loadState();
    setupEventListeners();
    updateUI();
    updateLocationUI();

    localStorage.removeItem('currentUser');
    const productsPage = !!document.getElementById('products-container');
    const cartPage = !!document.getElementById('cart-items');

    if (productsPage) renderProducts('all');
    if (cartPage) initCartPage();

    const deliveryInfo = JSON.parse(localStorage.getItem('deliveryNotification'));
    if (deliveryInfo?.show) {
      const currentTime = Date.now();
      if (currentTime - deliveryInfo.timestamp < 300000) {
        showDeliveryNotification(deliveryInfo.minutes);
      }
    }
  } catch (error) {
    console.error('Initialization error:', error);
  }

  
}

// Core Functionality
function updateUI() {
  try {
    const isLoggedIn = !!user;

    // If admin is logged in, hide both login and register
    if (isAdmin) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (registerBtn) registerBtn.style.display = 'none';
      if (cartBtn) cartBtn.style.display = 'none';

      // Show admin profile button if applicable
      if (profileBtn) profileBtn.style.display = 'block';

      // Add admin panel button if not already there
      if (!document.querySelector('.btn-admin')) addAdminButton();
    } else {
      // Regular user UI
      if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'block';
      if (registerBtn) registerBtn.style.display = isLoggedIn ? 'none' : 'block';
      if (profileBtn) profileBtn.style.display = isLoggedIn ? 'block' : 'none';
      if (cartBtn) cartBtn.style.display = 'block';
    }

    updateLocationUI();
  } catch (error) {
    console.error('UI update error:', error);
  }
}


// Cart Logic
function updateCart() {
  localStorage.setItem(STATE_KEYS.CART, JSON.stringify(cart));
  updateCartUI();
  if (document.getElementById('cart-items')) renderCartItems();
}

function checkout() {
  try {
    if (!user) return alert('Please login to checkout');
    if (!cart.length) return alert('Cart is empty');
    if (!userLocation) return alert('Select delivery location');
    
    const totalText = document.getElementById('cart-total').textContent;
    const totalValue = parseFloat(totalText.replace(/[^0-9.]/g, ''));


    const order = {
      id: 'FM-' + Math.floor(Math.random() * 1000000),
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      deliveryFee: 2.99,
      total: totalValue,
      location: userLocation,
      status: 'preparing',
      deliveryMinutes: Math.floor(Math.random() * 3) + 10
    };

    user.orders = user.orders || [];
    user.orders.unshift(order);
    localStorage.setItem(STATE_KEYS.USER, JSON.stringify(user));
    
    cart = [];
    updateCart();
    showOrderSuccess(order);
    showDeliveryNotification(order.deliveryMinutes);
  } catch (error) {
    console.error('Checkout error:', error);
    showToast('Checkout failed');
  }
}

// Utilities
function showToast(message) {
  if (!validateToast()) return;
  try {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  } catch (error) {
    console.error('Toast error:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);