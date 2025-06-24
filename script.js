function goToSignUp() {
  // This will be linked to your actual signup page
  window.location.href = "signup.html";
}

function goToLogin() {
  // This will be linked to your actual login page
  window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', () => {
  // Sign Up logic
 document.getElementById("signupForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  firebaseFns.createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Account created! You can now log in.");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});


  // Login logic
 document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebaseFns.signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Login successful!");
      localStorage.setItem("morleysUser", JSON.stringify({ uid: user.uid, email: user.email }));
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

  firebaseFns.signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert("⚠️ Please verify your email before logging in.");
      user.sendEmailVerification().then(() => {
        alert("📩 Verification email resent.");
        window.location.href = "verify.html";
      });
      return;
    }

    // Verified – continue
    localStorage.setItem("morleysUser", JSON.stringify({ uid: user.uid, email: user.email }));
    window.location.href = "index.html";
  })
  .catch((error) => {
    alert("Login failed: " + error.message);
  });


function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show');
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  alert("Logged out successfully.");
  window.location.href = "index.html";
}

// Optional: Display stored username
window.addEventListener('DOMContentLoaded', () => {
  const storedUser = JSON.parse(localStorage.getItem('morleysUser'));
  if (storedUser) {
    document.getElementById('username').textContent = `Hello, ${storedUser.name}`;
  }
});

function showCategory(category) {
  const display = document.getElementById("foodDisplay");
  let content = `<h2>${category}</h2><div class="food-list">`;

  const foodItems = {
    'Pizza': [
      { label: "Large - GHS 60", price: 60, img: "images/pizza.png" },
      { label: "Medium - GHS 45", price: 45, img: "images/pizza.png" },
      { label: "Small - GHS 30", price: 30, img: "images/pizza.png" }
    ],
    'Shawarma': [
      { label: "Large - GHS 40", price: 40, img: "images/shawarma.png" },
      { label: "Medium - GHS 30", price: 30, img: "images/shawarma.png" },
      { label: "Small - GHS 20", price: 20, img: "images/shawarma.png" }
    ],
    'Jollof Rice': [
      { label: "Big Pack - GHS 25", price: 25, img: "images/jollof.png" },
      { label: "Small Pack - GHS 15", price: 15, img: "images/jollof.png" }
    ],
    'Fried Rice': [
      { label: "Big Pack - GHS 25", price: 25, img: "images/fried_rice.png" },
      { label: "Small Pack - GHS 15", price: 15, img: "images/fried_rice.png" }
    ],
    'Drinks': [
      { label: "Coke - GHS 8", price: 8, img: "images/coke.png" },
      { label: "Fanta - GHS 8", price: 8, img: "images/fanta.png" },
      { label: "Water - GHS 4", price: 4, img: "images/water.png" }
    ]
  };

  if (foodItems[category]) {
    foodItems[category].forEach((item, index) => {
      content += `
        <div class="food-item">
          <img src="${item.img}" alt="${item.label}">
          <span>${item.label}</span>
          <button onclick="addToCart('${category}', ${index})">Add to Cart</button>
        </div>
      `;
    });
  } else {
    content += "<p>No items available in this category.</p>";
  }

  content += "</div>";
  display.innerHTML = content;
}


function addToCart(category, index) {
  const cart = JSON.parse(localStorage.getItem('morleysCart')) || [];

  const foodItems = {
    'Pizza': [
      { label: "Large - GHS 60", price: 60, img: "images/pizza.png" },
      { label: "Medium - GHS 45", price: 45, img: "images/pizza.png" },
      { label: "Small - GHS 30", price: 30, img: "images/pizza.png" }
    ],
    'Shawarma': [
      { label: "Large - GHS 40", price: 40, img: "images/shawarma.png" },
      { label: "Medium - GHS 30", price: 30, img: "images/shawarma.png" },
      { label: "Small - GHS 20", price: 20, img: "images/shawarma.png" }
    ],
    'Jollof Rice': [
      { label: "Big Pack - GHS 25", price: 25, img: "images/jollof.png" },
      { label: "Small Pack - GHS 15", price: 15, img: "images/jollof.png" }
    ],
    'Fried Rice': [
      { label: "Big Pack - GHS 25", price: 25, img: "images/fried_rice.png" },
      { label: "Small Pack - GHS 15", price: 15, img: "images/fried_rice.png" }
    ],
    'Drinks': [
      { label: "Coke - GHS 8", price: 8, img: "images/coke.png" },
      { label: "Fanta - GHS 8", price: 8, img: "images/fanta.png" },
      { label: "Water - GHS 4", price: 4, img: "images/water.png" }
    ]
  };

  const selectedItem = foodItems[category][index];
  cart.push(selectedItem);
  localStorage.setItem('morleysCart', JSON.stringify(cart));

  alert(`${selectedItem.label} added to cart!`);
}


// Load and display cart
function loadCart() {
  const cart = JSON.parse(localStorage.getItem('morleysCart')) || [];
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalSpan = document.getElementById('cartTotal');

  if (!cartItemsContainer || !cartTotalSpan) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalSpan.textContent = "0.00";
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price;
    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.label}">
        <span>${item.label}</span>
        <span>GHS ${item.price.toFixed(2)}</span>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  cartTotalSpan.textContent = total.toFixed(2);
}

// Remove from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('morleysCart')) || [];
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    localStorage.setItem('morleysCart', JSON.stringify(cart));
    loadCart();
  }
}

// Placeholder for checkout
function proceedToCheckout() {
  alert("Proceeding to checkout... (Coming soon)");
}

// Auto-run when on cart page
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.href.includes("cart.html")) {
    loadCart();
  }
});


// Load total for checkout
function loadCheckoutTotal() {
  const cart = JSON.parse(localStorage.getItem('morleysCart')) || [];
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  const checkoutTotal = document.getElementById('checkoutTotal');
  if (checkoutTotal) checkoutTotal.textContent = total.toFixed(2);
}

// Show input when payment method is selected
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.href.includes("checkout.html")) {
    loadCheckoutTotal();

    const radios = document.querySelectorAll('input[name="paymentMethod"]');
    radios.forEach(radio => {
      radio.addEventListener("change", () => {
        const value = radio.value;
        document.getElementById('momoFields').style.display = (value === 'Mobile Money' || value === 'Telecel Cash') ? 'block' : 'none';
        document.getElementById('visaFields').style.display = (value === 'VISA') ? 'block' : 'none';
      });
    });

    const form = document.getElementById("paymentForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const method = form.paymentMethod.value;
      let paymentInfo = {};

      // Collect and validate
      if (method === "VISA") {
        const name = document.getElementById("visaName").value.trim();
        const number = document.getElementById("visaNumber").value.trim();
        const expiry = document.getElementById("visaExpiry").value.trim();
        const cvv = document.getElementById("visaCVV").value.trim();

        if (!name || !number || !expiry || !cvv) {
          alert("Please fill in all VISA card fields.");
          return;
        }

        paymentInfo = { name, number, expiry, cvv };

      } else {
        const name = document.getElementById("momoName").value.trim();
        const number = document.getElementById("momoNumber").value.trim();

        if (!name || !number) {
          alert("Please enter your Mobile Money/Telecel account details.");
          return;
        }

        paymentInfo = { name, number };
      }

      // Simulate payment
      simulatePayment(method, paymentInfo);
    });
  }
});

function simulatePayment(method, paymentInfo) {
  // Show loading
  const main = document.querySelector("main");
  main.innerHTML = `
    <h2>Processing Payment...</h2>
    <p>Please wait while we confirm your ${method} payment.</p>
    <div class="loader"></div>
  `;

  setTimeout(() => {
    const cart = JSON.parse(localStorage.getItem('morleysCart')) || [];
    const orderHistory = JSON.parse(localStorage.getItem('morleysOrders')) || [];
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const order = {
      items: cart,
      total,
      method,
      paymentInfo,
      date: new Date().toLocaleString()
    };

    orderHistory.push(order);
    localStorage.setItem('morleysOrders', JSON.stringify(orderHistory));
    localStorage.removeItem('morleysCart');

// Send SMS if phone provided
const phone = document.getElementById("phoneNumber").value.trim();

if (phone) {
  fetch("http://localhost:5000/send-sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone,
      message: `Hello ${paymentInfo.name}, your order of GHS ${total.toFixed(2)} has been received. Thanks for ordering at Morleys Restaurant!`
    })
  })
  .then(res => res.json())
  .then(data => {
    if (!data.success) {
      alert("Order placed, but SMS not sent.");
    }
  })
  .catch(err => {
    console.error("SMS failed:", err);
    alert("Order placed, but SMS failed.");
  });
}


    // Show success page
    main.innerHTML = `
      <h2>✅ Payment Successful</h2>
      <p>Thank you for your order!</p>
      <p><strong>Payment Method:</strong> ${method}</p>
      <p><strong>Total Paid:</strong> GHS ${total.toFixed(2)}</p>
      <p><strong>Order Date:</strong> ${order.date}</p>
      <button onclick="window.location.href='orders.html'" class="checkout-btn">View Order Summary</button>
    `;
  }, 2000);
}


function loadCheckoutTotal() {
  const cart = JSON.parse(localStorage.getItem('morleysCart')) || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const checkoutTotal = document.getElementById('checkoutTotal');
  if (checkoutTotal) checkoutTotal.textContent = `GHS ${total.toFixed(2)}`;
}

function loadOrderHistory() {
  const orders = JSON.parse(localStorage.getItem('morleysOrders')) || [];
  const container = document.getElementById('orderHistoryContainer');

  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = "<p>You have no past orders.</p>";
    return;
  }

  let output = "";

  orders.reverse().forEach((order, i) => {
    let itemsList = order.items.map(item => `
      <div class="order-item">
        <img src="${item.img}" alt="${item.label}">
        <span>${item.label}</span>
        <span class="price">GHS ${item.price.toFixed(2)}</span>
      </div>
    `).join("");

    output += `
      <div class="order-card" id="order-${i}">
    <div class="order-header">
      <strong>Order #${orders.length - i}</strong> <span>${order.date}</span>
    </div>
    <div class="order-body">
      ${itemsList}
    </div>
    <div class="order-footer">
      <p><strong>Total:</strong> GHS ${order.total.toFixed(2)}</p>
      <p><strong>Payment:</strong> ${order.method}</p>
      <button class="print-btn" onclick="printOrder('order-${i}')">🖨 Print Receipt</button>
    </div>
  </div>
    `;
  });

  container.innerHTML = output;
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.location.href.includes("orders.html")) {
    loadOrderHistory();
  }
});


function printOrder(orderId) {
  const orderContent = document.getElementById(orderId).innerHTML;
  const printWindow = window.open('', '', 'width=600,height=800');

  printWindow.document.write(`
    <html>
    <head>
      <title>Receipt - Morleys Restaurant</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .order-header, .order-footer { margin-bottom: 15px; }
        .order-item { display: flex; justify-content: space-between; margin-bottom: 8px; }
        img { width: 40px; height: 40px; margin-right: 10px; vertical-align: middle; }
        .label { flex: 1; }
      </style>
    </head>
    <body>
      <h2>Morleys Restaurant</h2>
      <div class="receipt-content">
        ${orderContent}
      </div>
      <hr>
      <p>Thank you for ordering with us!</p>
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `);

  printWindow.document.close();
}


function payWithPaystack() {
  const cart = JSON.parse(localStorage.getItem('morleysCart')) || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  const name = document.getElementById("momoName")?.value || document.getElementById("visaName")?.value || "Customer";
  const phone = document.getElementById("phoneNumber").value || "0000000000";
  const email = `${name.replace(" ", "").toLowerCase()}@morleys.com`; // mock email

  let handler = PaystackPop.setup({
    key: 'pk_live_132bcfe226499aceb0d2ecd71f4890a495c283b3', // Replace with your real public key
    email: email,
    amount: parseFloat(total) * 100, // amount in pesewas
    currency: 'GHS',
    ref: 'morleys-' + Date.now(),
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: name
        },
        {
          display_name: "Mobile Number",
          variable_name: "mobile_number",
          value: phone
        }
      ]
    },
    callback: function (response) {
      // Save Order
      const orderHistory = JSON.parse(localStorage.getItem('morleysOrders')) || [];
      const order = {
        items: cart,
        total: parseFloat(total),
        method: "Paystack - " + response.payment_type,
        date: new Date().toLocaleString(),
        ref: response.reference
      };

      orderHistory.push(order);
      localStorage.setItem('morleysOrders', JSON.stringify(orderHistory));
      localStorage.removeItem('morleysCart');

      alert("✅ Payment successful! Ref: " + response.reference);
      window.location.href = "orders.html";
    },
    onClose: function () {
      alert('Payment window closed.');
    }
  });

  handler.openIframe();
}


if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log("✅ Service Worker Registered"))
      .catch(err => console.error("❌ SW registration failed", err));
  });
}


let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show your custom install button
  const installBtn = document.getElementById('installApp');
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install');
      }
      deferredPrompt = null;
    });
  });
});


const firebaseConfig = {
  apiKey: "AIzaSyD7viifv2hVZenTc7FX2f_fhusrMb_QbEg",
  authDomain: "morleys-restaurant.firebaseapp.com",
  projectId: "morleys-restaurant",
  storageBucket: "morleys-restaurant.firebasestorage.app",
  messagingSenderId: "430306650328",
  appId: "1:430306650328:web:ecfe9f04bf7b9d17154fad",
  measurementId: "G-JF16BTQ2Q9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


 firebaseFns.createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;

    user.sendEmailVerification()
      .then(() => {
        alert("✅ Verification email sent! Please check your inbox.");
        window.location.href = "verify.html";
      })
      .catch((error) => {
        alert("❌ Failed to send verification: " + error.message);
      });
  })
  .catch((error) => {
    alert("Signup failed: " + error.message);
  });
                         
