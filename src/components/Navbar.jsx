import React from "react";
import { FiHome, FiUser, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white text-black p-4 flex justify-between items-center shadow-md z-10">
      <div className="flex items-center space-x-2">
        {/* Logo */}
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="w-8 h-8 object-contain"
        />
        {/* Brand Name */}
        <h1 className="text-xl font-bold">Marrfa</h1>
      </div>

      <ul className="flex space-x-4">
        <li>
          <a href="/dashboard" className="flex items-center space-x-1">
            <FiHome />
            <span>Home</span>
          </a>
        </li>
        <li>
          <a href="/profile" className="flex items-center space-x-1">
            <FiUser />
            <span>Profile</span>
          </a>
        </li>
        <li>
          <a href="/" className="flex items-center space-x-1">
            <FiLogOut />
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
