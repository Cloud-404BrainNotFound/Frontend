import React, { useState, useEffect } from 'react';

const LandingPage = () => {
  const [user, setUser] = useState(null);

  // simulated check for user login 
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setUser({ name: 'John Doe' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
  };

  return (
    <div className="bg-neutral-50 text-neutral-900 font-serif"> {/* Applied font-serif to the whole page */}
      {/* Header Section */}
      <header className="bg-primary-500 text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6">
          {/* Logo with white background, black text */}
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white rounded-full">
              <img
                src="/img/sslogo.png"
                alt="Swing Swift Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
          <nav className="space-x-6">
            <a href="/about" className="text-white hover:text-primary-300">About Us</a>
            <a href="/help" className="text-white hover:text-primary-300">Help</a>
          </nav>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="text-center mb-6 px-6 mt-12"> {/* Added margin top */}
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
