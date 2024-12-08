import React, { useState } from 'react';
import './customStyles.css';
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import firebaseConfig from "./connection_db";

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const app = initializeApp(firebaseConfig);
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Sign-in with Google successful:", user);

      localStorage.setItem("username", user.displayName || username);
      localStorage.setItem("email", user.email);
      console.log("Stored email (Google Sign-In):", user.email);

      const userDoc = doc(db, "Users", user.email);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        await setDoc(userDoc, {
          UserName: user.displayName || username, 
          Email: user.email,
          Phone: user.phone || "", // Optional phone
        });
        console.log("User information saved to Firestore");
      } else {
        console.log("User already exists in Firestore");
      }

      window.location.href = '/Dashboard';
    } catch (error) {
      console.error("Sign-in with Google error:", error.code, error.message);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (password.length < 6) {
      setError("Password should be at least 6 characters long");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Signup successful:", user);

      localStorage.setItem("username", username);
      localStorage.setItem("email", user.email);
      console.log("Stored email (Manual Signup):", user.email);

      const userDoc = doc(db, "Users", user.email);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        await setDoc(userDoc, {
          UserName: username,
          Email: user.email,
          Phone: "", // Optional phone
        });
        console.log("User information saved to Firestore");
      } else {
        console.log("User already exists in Firestore");
      }

      window.location.href = '/Dashboard';
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center bg-white">
      {/* Left Section with Video - hidden on mobile */}
      <div className="hidden lg:block lg:w-2/5 relative">
        <h1 className="absolute top-5 left-5 text-xl font-bold text-white z-20">Marrfa</h1>
        <video 
          className="w-full h-full object-cover z-10" 
          autoPlay 
          muted 
          loop 
          style={{ height: '100vh', width: '100%', position: 'relative' }}
        >
          <source src="/assets/signup.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Right Section with Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center lg:pl-32 xl:pl-48 p-6">
        <div className="w-full max-w-md p-8 bg-white">
          <div className="block lg:hidden mb-4 text-center">
            <img src="/assets/logo.png" alt="Company Logo" className="mx-auto mb-2" style={{ width: '100px', height: '100px' }} />
            <h1 className="text-2xl font-bold">Marrfa</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
            Create an Account
          </h2>

          {/* Google Sign up */}
          <div className="flex items-center justify-center mb-4">
            <button 
              className="flex items-center justify-center w-full py-2 px-3 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              onClick={signInWithGoogle}
            >
              <img src="/assets/google.png" alt="Google Logo" className="w-5 h-5 mr-2" />
              Sign up with Google
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 mb-3">or sign up with email</div>

          {/* Signup Form */}
          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Username</label>
              <input
                type="text"
                className="w-full common-input border border-gray-400 p-2 rounded-lg"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                className="w-full common-input border border-gray-400 p-2 rounded-lg"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                className="w-full common-input border border-gray-400 p-2 rounded-lg"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Display error message */}
            {error && <div className="text-red-500 text-sm">{error}</div>}

            {/* Sign Up Button */}
            <button type="submit" className="w-full common-button text-white bg-black py-2 px-3 rounded-lg hover:bg-gray-800">
              Sign Up
            </button>
          </form>

          {/* Sign in Section */}
          <p className="mt-4 text-center text-xs text-gray-600">
            Already have an account? <a href="/login" className="text-blue-500 hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
