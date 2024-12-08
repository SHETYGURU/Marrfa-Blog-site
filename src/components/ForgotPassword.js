import React, { useState } from 'react'; 
import './customStyles.css';
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebaseConfig from "./connection_db"; 

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const ForgotPassword = () => {
  const [email, setEmail] = useState(''); 
  const [message, setMessage] = useState(null); 
  const [loading, setLoading] = useState(false); 

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({
        type: 'success',
        text: `A password reset link has been sent to ${email}. Check your email inbox.`,
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: `An error occurred: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center bg-white">
      {/* Left Section with Video */}
      <div className="hidden lg:block lg:w-2/5">
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
        <div className="w-full max-w-sm" id="forgotPasswordCard">
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">
            Forgot Password
          </h2>

          {message && (
            <p className={`text-center ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message.text}
            </p>
          )}

          <form className="space-y-4" onSubmit={handlePasswordReset}>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                className="w-full common-input border border-gray-400 p-2 rounded-lg"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              className="w-full common-button text-white bg-black py-2 px-3 rounded-lg hover:bg-gray-800"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-600">
            Remember your password? <a href="/login" className="text-blue-500 hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
