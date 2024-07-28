// client/src/components/Navbar.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthContext"; // Make sure to import your AuthContext
import { Icon } from "@iconify/react/dist/iconify.js";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-indigo-600 shadow-md p-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo/Title */}
        <Link
          to="/"
          className="text-xl flex items-center gap-2 tracking-tighter font-bold text-white"
        >
          <Icon icon="mdi:library" className="text-3xl" />
          My Library
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden flex items-center h-full">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <Icon icon="mdi:menu" className="text-3xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <ul className={`md:flex space-x-4 items-center hidden md:block`}>
          <li>
            <Link
              to="/"
              className="hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Home
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/add"
                  className="hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Add Book
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="hover:bg-gray-100 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:bg-gray-100 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <ul className="space-y-4 mt-4">
          <li>
            <Link
              to="/"
              className="block hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              onClick={toggleMenu}
            >
              Home
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/add"
                  className="block hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                  onClick={toggleMenu}
                >
                  Add Book
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="block hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="block hover:bg-gray-100 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="block hover:bg-gray-100 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
