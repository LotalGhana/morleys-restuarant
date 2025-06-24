 // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Make them global
  window.auth = auth;
  window.db = db;

<script>
  const firebaseConfig = {
  apiKey: "AIzaSyD7viifv2hVZenTc7FX2f_fhusrMb_QbEg",
  authDomain: "morleys-restaurant.firebaseapp.com",
  projectId: "morleys-restaurant",
  storageBucket: "morleys-restaurant.firebasestorage.app",
  messagingSenderId: "430306650328",
  appId: "1:430306650328:web:ecfe9f04bf7b9d17154fad",
  measurementId: "G-JF16BTQ2Q9"
};
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Expose globally for script.js
  window.auth = auth;
  window.db = db;
  window.firebaseFns = {
    createUserWithEmailAndPassword: firebase.auth().createUserWithEmailAndPassword,
    signInWithEmailAndPassword: firebase.auth().signInWithEmailAndPassword,
    signOut: firebase.auth().signOut
  };
</script>

window.firebaseFns = {
  createUserWithEmailAndPassword: firebase.auth().createUserWithEmailAndPassword,
  signInWithEmailAndPassword: firebase.auth().signInWithEmailAndPassword,
  signOut: firebase.auth().signOut,
  setUserDoc: (uid, data) => firebase.firestore().collection("users").doc(uid).set(data),
  getServerTimestamp: () => firebase.firestore.FieldValue.serverTimestamp()
};
