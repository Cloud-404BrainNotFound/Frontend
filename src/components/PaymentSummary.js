import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const {
    orderData,
    onPaymentSuccess
  } = location.state || {};

  const {
    sport,
    racket_model: racketModel,
    string,
    tension,
    notes,
    pickup_date: pickupDate,
    price: selectedStringPrice,
  } = orderData || {};

  const today = new Date();
  const isSameDay =
    pickupDate &&
    today.getFullYear() === pickupDate.getFullYear() &&
    today.getMonth() === pickupDate.getMonth() &&
    today.getDate() === pickupDate.getDate();

  const totalPrice = isSameDay ? selectedStringPrice + 5 : selectedStringPrice;

  // Payment states
  // Payment Details Limitation
  // Local validation
  // Send payment data to the backend 
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    
    const isValidPayment = cardNumber.replace(/\s+/g, '').length === 16 &&
                            expiryMonth && expiryYear && cvc.length === 3;

    if (isValidPayment) {
      setPaymentStatus('Payment Successful');
      alert('Payment Successful!');

      // Call the order submission function passed from StringingOrder
      await onPaymentSuccess(orderData);
    } else {
      setPaymentStatus('Payment Failed');
      alert('Payment Failed: Please fill all fields correctly.');
    }
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s+/g, '').slice(0, 16);
    const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formattedValue);
  };

  const handleExpiryMonthChange = (e) => {
    setExpiryMonth(e.target.value);
  };

  const handleExpiryYearChange = (e) => {
    setExpiryYear(e.target.value);
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvc(value);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-start justify-center pt-8">
      <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-lg">
        {/* Summary Section */}
        <div className="w-1/2 p-6">
          <h2 className="text-4xl font-bold mb-4 text-center text-primary-800">Order Summary</h2>
          <div className="mb-4">
            <div className="flex justify-between text-lg mb-2">
              <span><strong>Sport:</strong></span>
              <span>{sport}</span>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span><strong>Racket Model:</strong></span>
              <span>{racketModel}</span>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span><strong>String:</strong></span>
              <span>{string}</span>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span><strong>Tension:</strong></span>
              <span>{tension}</span>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span><strong>Pickup Date:</strong></span>
              <span>{pickupDate ? pickupDate.toLocaleDateString() : 'Not specified'}</span>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span><strong>Notes:</strong></span>
              <span>{notes || 'No notes provided'}</span>
            </div>
          </div>
          <hr className="border-t-4 border-primary-500 mb-2" />
          <div className="flex justify-between text-2xl font-semibold">
            <span>Total Price:</span>
            <span className="text-black">${totalPrice.toFixed(2)}</span>
          </div>
          {isSameDay && <p className="text-red-500 text-sm">* Additional $5 for same-day pickup</p>}
        </div>

        {/* Payment Section */}
        <div className="w-1/2 p-6 border-l">
          <h2 className="text-4xl font-bold mb-4 text-center text-primary-800">Payment</h2>
          <form onSubmit={handlePayment}>
            <div className="mb-4">
              <label className="block text-primary-700 text-sm font-semibold mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 1234 5678"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="input input-bordered input-primary w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-primary-700 text-sm font-semibold mb-2">Expiry Date</label>
              <div className="flex space-x-2">
                <select
                  value={expiryMonth}
                  onChange={handleExpiryMonthChange}
                  className="input input-bordered input-primary w-1/2"
                  required
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={`${String(i + 1).padStart(2, '0')}`}>
                      {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={expiryYear}
                  onChange={handleExpiryYearChange}
                  className="input input-bordered input-primary w-1/2"
                  required
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={String(new Date().getFullYear() + i)}>
                      {new Date().getFullYear() + i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-primary-700 text-sm font-semibold mb-2">CVC</label>
              <input
                type="text"
                placeholder="CVC"
                value={cvc}
                onChange={handleCvcChange}
                className="input input-bordered input-primary w-full"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">Submit Payment</button>
          </form>
          {paymentStatus && (
            <p className={`mt-4 text-center font-semibold ${paymentStatus === 'Payment Successful' ? 'text-green-600' : 'text-red-600'}`}>
              {paymentStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
