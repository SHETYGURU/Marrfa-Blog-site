import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    // Fetch username and email from localStorage
    const storedUsername = localStorage.getItem("username") || "Guest";
    const storedEmail = localStorage.getItem("email") || "guest@example.com";

    setUser({
      username: storedUsername,
      email: storedEmail,
    });
  }, []);

  return (
    <div>
        <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-100">
      {/* GIF */}
      <img
        src="/assets/profile.gif"
        alt="Welcome"
        className="w-48 h-48 rounded-full "
      />

      {/* User Information */}
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.username}</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
    </div>

  );
};

export default Profile;
