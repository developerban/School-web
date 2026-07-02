// ==========================================
// Firebase Configuration
// ==========================================

// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================
// Your Firebase Config
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyDgPe99qfdwZLFFoQcaZld9cR2YCYwEWf0",

    authDomain: "great-school-website.firebaseapp.com",

    projectId: "great-school-website",

    storageBucket: "great-school-website.firebasestorage.app",

    messagingSenderId: "1043983486528",

    appId: "1:1043983486528:web:a1fa8c81d4d5566c55d9a5",

    measurementId: "G-V1GN747QC6"

};

// ==========================================
// Initialize Firebase
// ==========================================

const app = initializeApp(firebaseConfig);

// ==========================================
// Services
// ==========================================

const auth = getAuth(app);

const db = getFirestore(app);

// ==========================================
// Export
// ==========================================

export { auth, db };