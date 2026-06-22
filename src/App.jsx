import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './Layout';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
// import Bookmarks from './pages/Bookmarks';
import DetailedForecast from './pages/Detailedforecast';
import Home from './pages/Home';
import SearchBar from './components/SearchBar';
import { WeatherProvider } from './contexts/WeatherContext';
import BookmarksPage from './pages/BookmarksPage';

export default function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#334155',
              color: '#fff',
            },
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            {/* <Route path="/bookmarks" element={<Bookmarks />} /> */}
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/details" element={<DetailedForecast />} />
            <Route path="/forecast/:id" element={<DetailedForecast />} />
          </Route>
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}