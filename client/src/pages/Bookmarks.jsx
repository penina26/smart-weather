import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookmarkCard, { EmptyBookmarkCard } from '../components/Bookmarkcard';
import RecentlyViewedCard from '../components/Recentlyviewedcard';
import AlertCard from '../components/Alerts';

const SAMPLE_BOOKMARKS = [
  {
    id: 1,
    city: 'Maui',
    country: 'HI',
    eventLabel: 'Surfing Trip',
    image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?w=400',
    temperature: 28,
    condition: 'Sunny',
    humidity: 12,
    wind: 14,
    advisory: 'Ideal Conditions',
    advisoryType: 'ideal',
  },
  {
    id: 2,
    city: 'Aspen',
    country: 'CO',
    eventLabel: 'Ski Weekend',
    image: 'https://images.pexels.com/photos/668880/pexels-photo-668880.jpeg?w=400',
    temperature: -4,
    condition: 'Partly Cloudy',
    humidity: null,
    wind: null,
    advisory: 'High UV',
    advisoryType: 'warning',
  },
  {
    id: 3,
    city: 'London',
    country: 'UK',
    eventLabel: 'Business Summit',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?w=400',
    temperature: 14,
    condition: 'Rain',
    humidity: 80,
    wind: null,
    advisory: 'Bring Umbrella',
    advisoryType: 'warning',
  },
];

const SAMPLE_RECENT = [
  { id: 1, city: 'Paris', country: 'FR', condition: 'Mostly Sunny', temperature: 19, image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?w=100', },
  { id: 2, city: 'New York', country: 'NY', condition: 'Light Rain', temperature: 16, image: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=100&q=80' },
  { id: 3, city: 'Yosemite', country: 'CA', condition: 'Clear Sky', temperature: 22, image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100&q=80' },
];

const SAMPLE_ALERT = {
  id: 1,
  location: 'Maui',
  message: 'in 48 hours. Consider rescheduling your surfing session for tomorrow morning.',
  ctaLabel: 'Adjust Plan',
  ctaAction: () => {},
};

function Bookmarks() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState(SAMPLE_BOOKMARKS);
  const [alert, setAlert] = useState(SAMPLE_ALERT);

  const handleRemove = (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleCardClick = (bookmark) => {
    navigate(`/forecast/${bookmark.id}`);
  };

  const handleRecentClick = (item) => {
    navigate(`/forecast/${item.id}`);
  };

  return (
    <main className="flex-grow bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Bookmarks</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Your weather-smart planned destinations and events.</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition duration-200">
            <span>✦</span>
            <span>Add New Bookmark</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-8">

          {/* Bookmark grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {bookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onRemove={handleRemove}
                  onClick={handleCardClick}
                />
              ))}
              <EmptyBookmarkCard onAdd={() => {}} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 flex flex-col gap-5">

            {/* Recently Viewed */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                Recently Viewed
              </h2>
              <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                {SAMPLE_RECENT.map((item) => (
                  <RecentlyViewedCard key={item.id} item={item} onClick={handleRecentClick} />
                ))}
              </div>
              <button className="mt-3 w-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl py-2 transition">
                View Browsing History
              </button>
            </div>

            {/* Alert */}
            {alert && (
              <AlertCard
                alert={alert}
                onDismiss={() => setAlert(null)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Bookmarks;