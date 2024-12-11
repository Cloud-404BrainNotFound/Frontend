import React, { useState, useEffect } from 'react';

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [queryInput, setQueryInput] = useState('query { databases(n: 4) }');
  const [queryResult, setQueryResult] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(null);

  // simulated check for user login 
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setUser({ name: 'John Doe' });
    }

    const fetchWeather = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,  
            maximumAge: 0,   
            enableHighAccuracy: false  
          });
        });

        const response = await fetch('http://3.80.156.123:7999/composite/weather');
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        setWeather({
          weather: [{ description: data.description }],
          main: { temp: data.temperature },
          wind: { speed: data.wind_speed },
          humidity: data.humidity,
          name: 'Local Weather',
          links: data._links
        });
        setWeatherError(null);
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeather(null);
        setWeatherError('Could not fetch weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
  };

  const executeQuery = async () => {
    setQueryLoading(true);
    setQueryError(null);
    try {
      const response = await fetch('http://3.80.156.123:9000/graphql', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
        },
        credentials: 'omit',
        body: JSON.stringify({
          query: queryInput
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setQueryResult(result);
    } catch (error) {
      console.error('Query execution error:', error);
      setQueryError('Failed to execute query: ' + error.message);
    } finally {
      setQueryLoading(false);
    }
  };

  return (
    <div className="bg-neutral-50 text-neutral-900 font-serif">
      {/* Header Section */}
      <header className="bg-primary-500 text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6">
          {/* Left side: Logo and Weather */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div>
              <img
                src="/img/sslogo.png"
                alt="Swing Swift Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            
            {/* Weather Widget */}
            <div className="flex flex-col items-start space-y-2">
              {loading ? (
                <div className="text-white text-sm animate-pulse">
                  Loading weather...
                </div>
              ) : weather ? (
                <>
                  {/* HATEOAS Weather Link Button - Now on top */}
                  {weather.links?.more_info && (
                    <a
                      href={weather.links.more_info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        px-4 py-2 rounded-lg shadow-lg 
                        transition duration-200 hover:scale-105
                        flex items-center space-x-2
                        ${weather.links.more_info.href.includes('bbc') 
                          ? 'bg-emerald-800 hover:bg-emerald-900 text-white' // Dark green for BBC
                          : weather.links.more_info.href.includes('cnn')
                          ? 'bg-[#90EE90] hover:bg-[#98FB98] text-emerald-900' // Custom light green for CNN
                          : 'bg-blue-500 hover:bg-blue-600 text-white'    // Default Blue
                        }
                      `}
                    >
                      <span>{weather.links.more_info.href.includes('bbc') ? 'BBC' : 
                             weather.links.more_info.href.includes('cnn') ? 'CNN' : ''}</span>
                      <span>Weather Forecast</span>
                      <span>↗️</span>
                    </a>
                  )}

                  {/* Weather Widget below */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                    <div className="text-white">
                      <div className="space-y-0.5">
                        <p className="text-xl font-bold">
                          {Math.round(weather.main.temp)}°F
                        </p>
                        <div className="text-xs opacity-90 grid grid-cols-2 gap-x-2">
                          <div className="flex items-center">
                            <span className="mr-1">💨</span>
                            <span>{weather.wind.speed} mph</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">💧</span>
                            <span>{weather.humidity}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-white text-sm">{weatherError || 'Weather unavailable'}</div>
              )}
            </div>

            {/* GraphQL Query Interface */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 shadow-lg min-w-[600px]">
              <div className="text-white">
                <p className="font-semibold text-base mb-1 border-b border-white/20 pb-0.5">
                  GraphQL Query
                </p>
                <div className="flex space-x-4">
                  {/* Query Input Side */}
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                      className="w-full p-2 bg-white/10 rounded text-sm text-white font-mono"
                      rows="2"
                      placeholder="Enter your GraphQL query..."
                    />
                    <button
                      onClick={executeQuery}
                      disabled={queryLoading}
                      className={`
                        w-full px-3 py-1 rounded
                        ${queryLoading 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-emerald-600 hover:bg-emerald-700'}
                        transition duration-200
                      `}
                    >
                      {queryLoading ? 'Executing...' : 'Execute Query'}
                    </button>
                  </div>

                  {/* Result Side */}
                  <div className="flex-1">
                    <div className="h-full">
                      {queryError && (
                        <div className="text-red-300 text-sm">
                          {queryError}
                        </div>
                      )}
                      {queryResult && (
                        <div>
                          <p className="text-sm font-semibold mb-1">Result:</p>
                          <pre className="text-xs bg-black/30 p-2 rounded overflow-auto max-h-[80px]">
                            {JSON.stringify(queryResult, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Navigation */}
          <nav className="space-x-6">
            <a href="/about" className="text-white hover:text-primary-300">About Us</a>
            <a href="/login" className="text-white hover:text-primary-300">Login</a>
            <a href="/signup" className="text-white hover:text-primary-300">Sign up</a>
          </nav>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="text-center mb-6 px-6 mt-12">
        {/* Logo Section Below the Heading */}
        <div className="mb-6">
          <img
            src="/img/sslogo.png"
            alt="Swing Swift Logo"
            className="h-40 w-auto object-contain mx-auto"  // mx-auto centers the image
          />
        </div>

        {/* Quote Section */}
        <blockquote className="text-3xl font-bold italic text-neutral-900 max-w-3xl mx-auto mb-2">
          "Your one-stop solution for professional racket stringing services."
        </blockquote>

        <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-0">
          No matter your level or skill, we provide expert stringing that ensures peak performance and durability.
        </p>
      </section>

      {/* Our Services Section */}
      <section className="text-center mb-8 px-52">
        <h2 className="text-3xl font-bold text-primary-600 mb-4 font-serif">
          Our Services Include:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Badminton Stringing */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
            <img
              src="/img/bad_stringing.jpg"
              alt="Badminton Stringing"
              className="w-full h-36 object-cover rounded-lg mb-4"  
            />
            <span className="text-5xl text-primary-500">🏸</span> 
            <h3 className="text-xl font-semibold mt-4 font-serif">Badminton Stringing</h3>  
            <p className="text-lg mt-2 text-neutral-700">Precision stringing for fast-paced badminton play, offering you the perfect balance of power and control for every smash and drop shot.</p>
          </div>

          {/* Tennis Stringing */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
            <img
              src="/img/tennis_stringing.jpg"
              alt="Tennis Stringing"
              className="w-full h-36 object-cover rounded-lg mb-4" 
            />
            <span className="text-5xl text-primary-500">🎾</span>  
            <h3 className="text-xl font-semibold mt-4 font-serif">Tennis Stringing</h3> 
            <p className="text-lg mt-2 text-neutral-700">Unleash your game with high-performance tennis stringing that enhances power, spin, and durability, tailored for every level of competition.</p>
          </div>

          {/* Squash Stringing */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
            <img
              src="/img/squash_stringing.jpg"
              alt="Squash Stringing"
              className="w-full h-36 object-cover rounded-lg mb-4"  
            />
            <span className="text-5xl text-primary-500">⚫️</span>  
            <h3 className="text-xl font-semibold mt-4 font-serif">Squash Stringing</h3> 
            <p className="text-lg mt-2 text-neutral-700">Engineered for quick reactions and intense rallies, our squash stringing boosts power and control, helping you dominate the court.</p>
          </div>
        </div>
      </section>

      {/* Login or Logout Section */}
      <section className="text-center mb-12 px-4">
        {user ? (
          <>
            <span className="text-xl font-semibold">Welcome, {user.name}!</span>
            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="px-8 py-3 bg-red-500 text-white rounded-lg text-lg hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div>
            <a
              href="/login"
              className="inline-block px-12 py-4 text-2xl font-bold bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition duration-200 font-serif"
            >
              Login to Start
            </a>
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer className="bg-primary-500 text-white text-center py-8 mt-16">
        <p>&copy; 2024 Swing Swift. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
