import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.jpg";

function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/65"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center py-16">
          <span className="px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm text-blue-100 border border-blue-300/20 mb-6">
            Smart Weather Planning
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Weather That
            <span className="block text-blue-400">Helps You Decide</span>
          </h1>

          <p className="max-w-3xl mt-6 text-lg md:text-xl text-slate-200">
            Get real-time weather forecasts transformed into practical
            recommendations that help you plan your day, travel, outdoor
            activities, and events with confidence.
          </p>

          {/* Search */}
          <div className="w-full max-w-3xl mt-10">
            <SearchBar />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              to="/signup"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;