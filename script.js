// Navigation helpers
function goToSignUp() {
  window.location.href = "signup.html";
}

function goToLogin() {
  window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', () => {
  // --- Signup Logic ---
  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("signupName");
      const emailInput = document.getElementById("signupEmail");
      const passwordInput = document.getElementById("signupPassword");

      if (!nameInput || !emailInput || !passwordInput) {
        alert("Please complete the form.");
        return;
      }

      const name = nameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          await user.sendEmailVerification();

          await firebase.firestore().collection("users").doc(user.uid).set({
            uid: user.uid,
            email: user.email,
            name: name,
            isVerified: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });

          alert("✅ Account created! Please verify your email.");
          window.location.href = "verify.html";
        })
        .catch((error) => {
          alert("❌ Signup failed: " + error.message);
        });
    });
  }

  // --- Login Logic ---
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailInput = document.getElementById("loginEmail");
      const passwordInput = document.getElementById("loginPassword");

      if (!emailInput || !passwordInput) {
        alert("Please fill in both fields.");
        return;
      }

      const email = emailInput.value;
      const password = passwordInput.value;

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          if (!user.emailVerified) {
            alert("⚠️ Please verify your email before logging in.");
            return;
          }

          localStorage.setItem("morleysUser", JSON.stringify({
            uid: user.uid,
            email: user.email
          }));

          alert("✅ Login successful!");
          window.location.href = "home.html";
        })
        .catch((error) => {
          alert("❌ Login failed: " + error.message);
        });
    });
  }
});
