import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-50 dark:bg-orange-900/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-10 z-10 transition-colors duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome to Atmosphere</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Your personalized weather-smart scheduling assistant.</p>
        </div>

        <div className="space-y-5">
          <p className="text-slate-700 dark:text-slate-300 text-center">
            Log in to sync your schedule with real-time weather insights and make the most of your day, rain or shine!
          </p>
            <div className="flex justify-center">
              <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                Log In
              </Link>
            </div>
        </div>
      </div>
    </main>
  );
}

export default Home;