import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, order } = location.state || {};
  
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching review for orderId:', orderId);
        const response = await fetch(`http://3.80.156.123:7999/composite/reviews/order/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch review');
        }
        const reviews = await response.json();
        console.log('API Response:', reviews);
        
        if (reviews && reviews.length > 0) {
          const review = reviews[0]; // Get first review
          console.log('First review:', review);
          setRating(review.rating || 0);
          setReview(review.content || '');
        } else {
          console.log('No reviews found in response');
        }
      } catch (error) {
        console.error('Error fetching review:', error);
        setError('Failed to fetch review information');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-8 flex justify-center items-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 p-8">
        <div className="container mx-auto max-w-3xl bg-white shadow-lg rounded-lg p-6">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="container mx-auto max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-primary-700 mb-6">Review Details</h1>
        
        {/* Order Information */}
        <div className="mb-8 p-6 bg-neutral-50 rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Order Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-lg text-neutral-600">Sport:</p>
            <p className="text-lg text-neutral-800">{order?.sport}</p>
            <p className="text-lg text-neutral-600">Racket:</p>
            <p className="text-lg text-neutral-800">{order?.racket_model}</p>
            <p className="text-lg text-neutral-600">String:</p>
            <p className="text-lg text-neutral-800">{order?.string}</p>
            <p className="text-lg text-neutral-600">Tension:</p>
            <p className="text-lg text-neutral-800">{order?.tension}</p>
          </div>
        </div>

        {/* Rating Display */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Rating:</h2>
          <div className="flex space-x-3">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`text-4xl ${index < rating ? 'text-yellow-400' : 'text-neutral-300'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Review:</h2>
          <div className="p-6 bg-neutral-50 rounded-lg">
            <p className="text-lg text-neutral-700">{review}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-6">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="px-6 py-3 text-lg bg-neutral-200 text-neutral-800 rounded hover:bg-neutral-300"
          >
            Back to Orders
          </button>
          <button
            type="button"
            onClick={() => navigate(`/write-review/${orderId}`, { 
              state: { 
                order: {
                  id: orderId,
                  ...order
                }
              } 
            })}
            className="px-6 py-3 text-lg bg-primary-500 text-white rounded hover:bg-primary-600"
          >
            Edit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReview;
