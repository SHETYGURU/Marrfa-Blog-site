import React, { useState } from 'react'; 
import './customStyles.css';
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import firebaseConfig from "./connection_db"; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

const Login = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = doc(db, "Users", user.email);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        await setDoc(userDoc, {
          UserName: user.displayName,
          Email: user.email,
          Phone: user.phone || "", // Make phone number optional
        });
      }

      localStorage.setItem("username", user.displayName ); 
      localStorage.setItem("email", user.email); 

   
     
        window.location.href = '/Dashboard';
    

    } catch (error) {
      console.error('Sign-in with Google error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

    //   const userDoc = doc(db, "Users", user.email);
    //   const userSnap = await getDoc(userDoc);

      localStorage.setItem("inputValue", user.email);
      window.location.href = '/Dashboard';
    } catch (error) {
      console.error('Login error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center bg-white">
      {/* Left Section with Video */}
      <div className="hidden lg:block lg:w-2/5">
      <h1 className="absolute top-5 left-5 text-xl font-bold text-white z-20">Marrfa</h1>

        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          style={{ height: '100vh', width: '100%', position: 'relative' }}
        >
          <source src="/assets/login.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Right Section with Form */}
      <div className="w-full lg:w-2/3 p-8 flex items-center justify-center lg:pl-32 xl:pl-48">
        <div className="w-full max-w-sm">
          {/* Logo and Company Name for Mobile View */}
          <div className="block lg:hidden mb-4 text-center">
            <img src="/assets/logo.png" alt="Company Logo" className="mx-auto mb-2" style={{ width: '100px', height: '100px' }} />
            <h1 className="text-2xl font-bold">Marrfa</h1>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">
            Log in to Your Account
          </h2>

          {/* Google Sign in */}
          <div className="flex items-center justify-center mb-6">
            <button
              className="flex items-center justify-center w-full max-w-xs py-2 px-3 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img src="/assets/google.png" alt="Google Logo" className="w-5 h-5 mr-2" />
              {loading ? 'Signing in...' : 'Log in with Google'}
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 mb-3">or login with email</div>
          {/* Email/Password Login */}
          <form className="space-y-4" onSubmit={handleEmailLogin}>
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

            <button
              className="w-full common-button text-white bg-black py-2 px-3 rounded-lg hover:bg-gray-800"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-600">
            Don’t have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
          </p>
          <p className="mt-2 text-center text-xs text-gray-600">
            <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot your password?</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
