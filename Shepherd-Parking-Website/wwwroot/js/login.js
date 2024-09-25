// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCt6Qx4jIHFfuF-pICv9UELAsp7PGLEBgc",
    authDomain: "shepherd-9a70b.firebaseapp.com",
    databaseURL: "https://shepherd-9a70b-default-rtdb.firebaseio.com",
    projectId: "shepherd-9a70b",
    storageBucket: "shepherd-9a70b.appspot.com",
    messagingSenderId: "752353533147",
    appId: "1:752353533147:web:94b11bb6cbcb6c239280fe",
    measurementId: "G-M0NX64WE41"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessageDiv = document.getElementById('error-message');

// Function to Display Error Messages
function displayError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}

// Clear Error Message
function clearError() {
    errorMessageDiv.textContent = '';
    errorMessageDiv.style.display = 'none';
}

// Simple email validation
function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

// Check if the user exists in the 'admins' collection
async function isAdmin(email) {
    const adminQuery = query(collection(db, 'admins'), where('AdminEmail', '==', email));
    const querySnapshot = await getDocs(adminQuery);
    return !querySnapshot.empty; // Returns true if admin exists, otherwise false
}

// Handle Login with Email and Password
loginBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent form from submitting

    clearError(); // Clear any existing error messages

    const email = emailInput.value;
    const password = passwordInput.value;

    // Basic validation for empty fields
    if (!email || !password) {
        displayError("Email and password are required.");
        return;
    }

    // Check if the email is in the correct format
    if (!isValidEmail(email)) {
        displayError("Email must include an '@' and a valid domain like '.com'.");
        return;
    }

    try {
        // Check if the user is in the admins collection first
        const isAdminUser = await isAdmin(email);
        if (!isAdminUser) {
            displayError("You do not have admin access.");
            return;
        }

        // If the user is an admin, proceed with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Redirect to the Test Page if login is successful
        alert(`Welcome! Redirecting to your dashboard...`);
        window.location.href = '/TestPage';  // Redirect to the test page

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        // Debugging: Log the error code and message to the console
        console.log("Error code:", errorCode);  // Log error code for debugging
        console.log("Error message:", errorMessage);  // Log error message for debugging

        // Handle specific error codes
        if (errorCode === 'auth/wrong-password') {
            displayError("Email or Password is incorrect.");
        } else if (errorCode === 'auth/user-not-found') {
            displayError("Account does not exist.");
        } else if (errorCode === 'auth/invalid-email') {
            displayError("Email must include an '@' and a valid domain like '.com'.");
        } else {
            displayError("An unexpected error occurred. Please try again.");
        }
    }
});
