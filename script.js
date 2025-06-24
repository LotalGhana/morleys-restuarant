// Navigation helpers (optional)
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

      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      firebaseFns.createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          // Send email verification
          await user.sendEmailVerification();

          // Save user data in Firestore
          await firebaseFns.setUserDoc(user.uid, {
            uid: user.uid,
            email: user.email,
            name: name,
            isVerified: false,
            createdAt: firebaseFns.getServerTimestamp()
          });

          alert("✅ Account created! Please check your email to verify.");
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

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      firebaseFns.signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          if (!user.emailVerified) {
            alert("⚠️ Please verify your email before logging in.");
            return;
          }

          // Store session locally
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
