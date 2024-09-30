import React, { useState } from 'react';
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

  const navigate = useNavigate();


  const sportsOptions = [
    {
      name: 'Tennis',
      emoji: '🎾',
      strings: [
        { name: 'Wilson Synthetic Gut', price: 20 },
        { name: 'Prince Synthetic Gut', price: 22 },
        { name: 'Gamma Synthetic Gut', price: 18 },
        { name: 'Wilson NXT', price: 30 },
        { name: 'Babolat Xcel', price: 35 },
        { name: 'Babolat VS Natural Gut', price: 40 },
        { name: 'Wilson Natural Gut', price: 45 },
        { name: 'Pacific Natural Gut', price: 50 },
        { name: 'Yonex Poly Tour Pro', price: 30 },
        { name: 'Babolat RPM Blast', price: 28 },
        { name: 'Luxilon ALU Power', price: 32 }
      ]
    },
    {
      name: 'Badminton',
      emoji: '🏸',
      strings: [
        { name: 'Exbolt 63', price: 15 },
        { name: 'Exbolt 65', price: 16 },
        { name: 'Exbolt 68', price: 17 },
        { name: 'BG65', price: 18 },
        { name: 'BG65Ti', price: 19 },
        { name: 'BG66', price: 20 },
        { name: 'BG80', price: 21 },
        { name: 'BG80P', price: 22 },
        { name: 'BG85', price: 23 },
        { name: 'Nanogy95', price: 25 },
        { name: 'Nanogy98', price: 27 },
        { name: 'Nanogy99', price: 29 }
      ]
    },
    {
      name: 'Squash',
      emoji: '⚫️',
      strings: [
        { name: 'Tecnifibre 305 Synthetic Gut', price: 20 },
        { name: 'Wilson NXT', price: 25 },
        { name: 'Ashaway Synthetic Gut', price: 22 },
        { name: 'Head Velocity', price: 23 },
        { name: 'Tecnifibre Multifeel', price: 24 },
        { name: 'Ashaway SuperNick XL', price: 26 },
        { name: 'Tecnifibre 305', price: 27 }
      ]
    },
  ];

  const handleSubmit = async(e) => {
    e.preventDefault();

    const selectedString = sportsOptions
      .find(s => s.name === sport)
      ?.strings.find(s => s.name === string);
      
    const selectedStringPrice = selectedString ? selectedString.price : 0;

    //Send the order data to the backend 
    try{
      const response = await axios.post('http://localhost:8000/create_order', {
        sport,
        racketModel,
        string,
        tension,
        notes,
        pickupDate,
        selectedStringPrice,
      });

      if (response.status == 200){
        navigate('/payment-summary', {
          state: {
            sport,
            racketModel,
            string,
            tension,
            notes,
            pickupDate,
            selectedStringPrice,
          },
        });
      } else {
        alert('Error submitting order. Please try again.');
      }
    } catch (err){
      alert('An error occurred while processing your order.');
    }
    
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary-800">Stringing Order</h2>
        <form onSubmit={handleSubmit}>
          {/* Sport Selection */}
          <div className="mb-4">
            <h3 className="block text-primary-700 text-sm font-semibold mb-2">Sport</h3>
            <div className="flex justify-center space-x-2">
              {sportsOptions.map(({ name, emoji }) => (
                <button
                  key={name}
                  type="button"
                  className={`btn ${sport === name ? 'btn-primary' : 'btn-outline'} p-2`}
                  onClick={() => {
                    setSport(name);
                    setString(''); // Reset string selection when sport changes
                  }}
                >
                  {emoji} {name}
                </button>
              ))}
            </div>
          </div>

          {/* Racket Model */}
          <div className="mb-4">
            <label className="block text-primary-700 text-sm font-semibold mb-2">Racket Model</label>
            <input
              type="text"
              value={racketModel}
              onChange={(e) => setRacketModel(e.target.value)}
              placeholder="Enter racket model"
              className="input input-bordered input-primary w-full"
              required
            />
          </div>

          {/* String Selection */}
          <div className="mb-4">
            <label className="block text-primary-700 text-sm font-semibold mb-2">String</label>
            <div className="relative">
              <select
                value={string}
                onChange={(e) => setString(e.target.value)}
                className="input input-bordered input-primary w-full rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select a string</option>
                {sport && sportsOptions.find(s => s.name === sport).strings.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
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
              className="input input-bordered input-primary w-full h-24 pt-2" // Added padding top
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
  );
};

export default StringingOrder;
