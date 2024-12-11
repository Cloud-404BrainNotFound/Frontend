import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Add your images here
  const images = [
    '/img/string1.png',
    '/img/string2.png',
    '/img/string3.jpg',
    '/img/string4.jpg',
  ];

  // Auto-scroll images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section with Image Carousel */}
      <div className="relative h-[500px] overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">Welcome to String Swift</h1>
            <p className="text-xl">Revolutionizing Racket Stringing Services</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-primary-700 mb-6">Our Mission</h2>
          <p className="text-lg text-neutral-700 leading-relaxed">
            In the realm of racket sports, both professional and amateur players frequently find themselves 
            needing to restring their rackets on a weekly basis. String Swift is here to revolutionize 
            this experience by providing a streamlined, digital solution for all your stringing needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            title="Digital Ordering"
            description="Effortlessly input your racket details and stringing preferences through our intuitive interface."
            icon="📱"
          />
          <FeatureCard
            title="Real-time Updates"
            description="Stay informed about your stringing job status with instant notifications."
            icon="🔔"
          />
          <FeatureCard
            title="Secure Payments"
            description="Complete transactions safely and conveniently through our platform."
            icon="💳"
          />
          <FeatureCard
            title="Player Profiles"
            description="Store your preferences and racket details for quick future orders."
            icon="👤"
          />
          <FeatureCard
            title="Review System"
            description="Share your experience and help others make informed decisions."
            icon="⭐"
          />
          <FeatureCard
            title="Inventory Management"
            description="Stringers can efficiently manage their string inventory and supplies."
            icon="📦"
          />
        </div>

        {/* Sports Coverage */}
        <div className="bg-primary-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-primary-700 mb-6 text-center">Sports We Cover</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <SportCard
              sport="Tennis"
              emoji="🎾"
              description="Professional tennis stringing services with precise tension control."
            />
            <SportCard
              sport="Badminton"
              emoji="🏸"
              description="Expert stringing for badminton rackets with various string options."
            />
            <SportCard
              sport="Squash"
              emoji="⚫"
              description="Quality stringing services for squash players of all levels."
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-700 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-neutral-700 mb-8">
            Join String Swift today and experience the future of racket stringing services.
          </p>
          <button 
            className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            onClick={() => navigate('/signup')}
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-primary-700 mb-2">{title}</h3>
    <p className="text-neutral-600">{description}</p>
  </div>
);

const SportCard = ({ sport, emoji, description }) => (
  <div className="text-center">
    <div className="text-6xl mb-4">{emoji}</div>
    <h3 className="text-xl font-bold text-primary-700 mb-2">{sport}</h3>
    <p className="text-neutral-600">{description}</p>
  </div>
);

export default AboutUs;
