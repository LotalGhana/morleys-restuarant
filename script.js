// Redirect functions
function goToSignUp() {
  window.location.href = "signup.html";
}

function goToLogin() {
  window.location.href = "login.html";
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameEl = document.getElementById('fullname');
      const emailEl = document.getElementById('email');
      const phoneEl = document.getElementById('phone');
      const passwordEl = document.getElementById('password');

      if (!nameEl || !emailEl || !phoneEl || !passwordEl) {
        alert('One or more input fields are missing.');
        return;
      }

      const user = {
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        phone: phoneEl.value.trim(),
        password: passwordEl.value.trim()
      };

      localStorage.setItem('morleysUser', JSON.stringify(user));
      alert('Account created successfully!');
      window.location.href = 'login.html';
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('loginEmail')?.value.trim();
      const password = document.getElementById('loginPassword')?.value.trim();
      const storedUser = JSON.parse(localStorage.getItem('morleysUser'));

      if (storedUser && storedUser.email === email && storedUser.password === password) {
        alert(`Welcome back, ${storedUser.name}!`);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'home.html';
      } else {
        alert('Invalid email or password!');
      }
    });
  }

  const storedUser = JSON.parse(localStorage.getItem('morleysUser'));
  const usernameEl = document.getElementById('username');
  if (storedUser && usernameEl) {
    usernameEl.textContent = `Hello, ${storedUser.name}`;
  }

  if (window.location.href.includes("cart.html")) {
    loadCart();
  }

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
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const method = form.paymentMethod.value;
        let paymentInfo = {};

        if (method === "VISA") {
          const name = document.getElementById("visaName")?.value.trim();
          const number = document.getElementById("visaNumber")?.value.trim();
          const expiry = document.getElementById("visaExpiry")?.value.trim();
          const cvv = document.getElementById("visaCVV")?.value.trim();

          if (!name || !number || !expiry || !cvv) {
            alert("Please fill in all VISA card fields.");
            return;
          }

          paymentInfo = { name, number, expiry, cvv };

        } else {
          const name = document.getElementById("momoName")?.value.trim();
          const number = document.getElementById("momoNumber")?.value.trim();

          if (!name || !number) {
            alert("Please enter your Mobile Money/Telecel account details.");
            return;
          }

          paymentInfo = { name, number };
        }

        simulatePayment(method, paymentInfo);
      });
    }
  }

  if (window.location.href.includes("orders.html")) {
    loadOrderHistory();
  }
});

function showCategory(category) {
  const display = document.getElementById("foodDisplay");
  if (!display) return;

  let content = `<h2>${category}</h2><div class="food-list">`;

  const foodItems = getFoodItems();

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

function getFoodItems() {
  return {
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
}

function addToCart(category, index) {
  const cart = JSON.parse(localStorage.getItem('morleysCart')) || [];
  const foodItems = getFoodItems();
  const selectedItem = foodItems[category][index];
  cart.push(selectedItem);
  localStorage.setItem('morleysCart', JSON.stringify(cart));
  alert(`${selectedItem.label} added to cart!`);
}

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

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('morleysCart')) || [];
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    localStorage.setItem('morleysCart', JSON.stringify(cart));
    loadCart();
  }
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
    const itemsList = order.items.map(item => `
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
  const phone = document.getElementById("phoneNumber")?.value || "0000000000";
  const email = `${name.replace(/\s+/g, '').toLowerCase()}@morleys.com`;

  let handler = PaystackPop.setup({
    key: 'pk_live_132bcfe226499aceb0d2ecd71f4890a495c283b3', // Replace with your real public key
    email: email,
    amount: parseFloat(total) * 100,
    currency: 'GHS',
    ref: 'morleys-' + Date.now(),
    metadata: {
      custom_fields: [
        { display_name: "Customer Name", variable_name: "customer_name", value: name },
        { display_name: "Mobile Number", variable_name: "mobile_number", value: phone }
      ]
    },
    callback: function (response) {
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
