import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {

    const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 py-6 px-8 flex flex-col md:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="mb-4 md:mb-0">
        {/* <div className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-1">Atmosphere</div> */}
        <div className="text-xs text-slate-500 dark:text-slate-400">© {currentYear} Atmosphere Weather. Precision in Every Forecast.</div>
      </div>
      <div className="flex space-x-4 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/privacy" className="hover:text-slate-800 dark:hover:text-slate-200 transition">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-slate-800 dark:hover:text-slate-200 transition">Terms of Service</Link>
        <Link to="/help" className="hover:text-slate-800 dark:hover:text-slate-200 transition">Help Center</Link>
        <Link to="/contact" className="hover:text-slate-800 dark:hover:text-slate-200 transition">Contact Us</Link>
      </div>
    </footer>
  );
}

export default Footer;