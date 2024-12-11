import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StringingOrder = () => {
  const [sport, setSport] = useState('');
  const [racketModel, setRacketModel] = useState('');
  const [string, setString] = useState('');
  const [tension, setTension] = useState('');
  const [notes, setNotes] = useState('');
  const [pickupDate, setPickupDate] = useState(null);
  const [availableOptions, setAvailableOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get('http://3.80.156.123:7999/composite/available-options');
        setAvailableOptions(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching options:', error);
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedSport = availableOptions?.sports.find(s => s.name === sport);
    const selectedString = selectedSport?.strings.find(s => s.name === string);
    const selectedRacket = selectedSport?.rackets.find(r => r.name === racketModel);
    
    const basePrice = availableOptions?.price_info.base_price || 0;
    const stringPrice = selectedString?.price || 0;
    const racketPrice = selectedRacket?.price || 0;
    
    const isSameDay = pickupDate && new Date().toDateString() === pickupDate.toDateString();
    const sameDayExtra = isSameDay ? (availableOptions?.price_info.same_day_pickup_extra || 0) : 0;
    
    const totalPrice = basePrice + stringPrice + racketPrice + sameDayExtra;

    const formattedPickupDate = pickupDate ? pickupDate.toISOString() : null;

    const orderData = {
      sport,
      racket_model: racketModel,
      string,
      tension,
      notes,
      pickup_date: formattedPickupDate,
      price: totalPrice,
    };

    // Store order data in localStorage
    localStorage.setItem('pendingOrderData', JSON.stringify(orderData));

    navigate('/payment-summary', {
      state: {
        orderData
      }
    });
  };
  
  const getSportEmoji = (sportName) => {
    switch (sportName) {
      case 'Tennis':
        return '🎾';
      case 'Badminton':
        return '🏸';
      case 'Squash':
        return '⚫️';
      default:
        return '';
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <div className="container mx-auto px-8 pt-8">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 px-0 py-4 mb-8 text-xl text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span className="text-2xl">←</span>
          Return to Profile
        </button>
      </div>
      
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary-800">Stringing Order</h2>
          <form onSubmit={handleSubmit}>
            {/* Sport Selection */}
            <div className="mb-4">
              <h3 className="block text-primary-700 text-sm font-semibold mb-2">Sport</h3>
              <div className="flex justify-center space-x-2">
                {availableOptions?.sports.map(({ name }) => (
                  <button
                    key={name}
                    type="button"
                    className={`btn ${sport === name ? 'btn-primary' : 'btn-outline'} p-2`}
                    onClick={() => {
                      setSport(name);
                      setString('');
                      setRacketModel('');
                    }}
                  >
                    {getSportEmoji(name)} {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Racket Model - Changed to dropdown */}
            <div className="mb-4">
              <label className="block text-primary-700 text-sm font-semibold mb-2">Racket Model</label>
              <select
                value={racketModel}
                onChange={(e) => setRacketModel(e.target.value)}
                className="input input-bordered input-primary w-full"
                required
              >
                <option value="">Select a racket</option>
                {sport && availableOptions?.sports
                  .find(s => s.name === sport)
                  ?.rackets.map(({ name }) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
              </select>
            </div>

            {/* String Selection */}
            <div className="mb-4">
              <label className="block text-primary-700 text-sm font-semibold mb-2">String</label>
              <select
                value={string}
                onChange={(e) => setString(e.target.value)}
                className="input input-bordered input-primary w-full"
                required
              >
                <option value="">Select a string</option>
                {sport && availableOptions?.sports
                  .find(s => s.name === sport)
                  ?.strings.map(({ name }) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
              </select>
            </div>

            {/* Tension */}
            <div className="mb-4">
              <label className="block text-primary-700 text-sm font-semibold mb-2">Tension</label>
              <input
                type="text"
                value={tension}
                onChange={(e) => setTension(e.target.value)}
                placeholder="e.g., 25 or 25x27"
                className="input input-bordered input-primary w-full"
                required
              />
            </div>

            {/* Desired Pickup Date */}
            <div className="mb-4">
              <label className="block text-primary-700 text-sm font-semibold mb-2">Desired Pickup Date</label>
              <DatePicker
                selected={pickupDate}
                onChange={(date) => setPickupDate(date)}
                dateFormat="MMMM d, yyyy"
                className="input input-bordered w-full max-w-xs"
                placeholderText="Select a date"
                isClearable
              />
            </div>
            
            {/* Notes to Stringer */}
            <div className="mb-4">
              <label className="block text-primary-700 text-sm font-semibold mb-2">Notes to Stringer</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes here"
                className="input input-bordered input-primary w-full h-24 pt-2"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StringingOrder;
