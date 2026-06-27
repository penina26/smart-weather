import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

function Navbar() {  
 
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <header className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
        <Link to="/">Atmosphere</Link>
      </div>
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
          Home
        </Link>
        <Link to="/bookmarks" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
          Bookmarks
        </Link>
        
  
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-4 ml-2 pl-6 border-l border-slate-200 dark:border-slate-700">
            <span className="text-slate-800 dark:text-slate-200">
              Hi, {user.name.split(' ')[0]}
            </span>
            <button 
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="ml-2 pl-6 border-l border-slate-200 dark:border-slate-700">
            <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition">
              Log In
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;