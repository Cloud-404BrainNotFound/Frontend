import React, { useState } from 'react';

const Payment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();

    const paymentData = {
      card_number: cardNumber,
      expiry_month: expiryMonth,
      expiry_year: expiryYear,  
      cvc: cvc,
    };

    console.log('Payment Data:', paymentData); 
    try {
      const response = await fetch('http://localhost:8000/payments/add_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment failed. Please check your details.');
      }

      const data = await response.json();
      setPaymentStatus('Payment Successful');
      alert(`Payment Successful! Payment ID: ${data.payment_id}`);
    } catch (error) {
      setPaymentStatus('Payment Failed');
      alert(error.message);
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
              placeholder="1234567812345678"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\s+/g, ''))} // Remove spaces
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-primary-700 text-sm font-semibold mb-2">Expiry Month</label>
            <input
              type="text"
              placeholder="MM"
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-primary-700 text-sm font-semibold mb-2">Expiry Year</label>
            <input
              type="text"
              placeholder="YY"
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
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
