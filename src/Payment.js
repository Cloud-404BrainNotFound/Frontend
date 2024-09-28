import React, { useState } from 'react';

const Payment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePayment = (e) => {
    e.preventDefault();

    if (cardNumber && expiryDate && cvc) {
      setPaymentStatus('Payment Successful');
      alert('Payment Successful!');
    } else {
      setPaymentStatus('Payment Failed');
      alert('Payment Failed: Please fill all fields correctly.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary-800">Payment</h2>
        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block text-primary-700 text-sm font-semibold mb-2">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 1234 5678"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-primary-700 text-sm font-semibold mb-2">Expiry Date</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-primary-700 text-sm font-semibold mb-2">CVC</label>
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
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
  );
};

export default Payment;

