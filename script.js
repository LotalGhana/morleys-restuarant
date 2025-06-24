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
