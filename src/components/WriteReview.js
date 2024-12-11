import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const WriteReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const userId = localStorage.getItem('user_id');

  console.log('WriteReview order from location:', order);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useEffect order:', order);
    
    if (!order?.id) {
      console.log('No order ID found');
      return;
    }

    const fetchExistingReview = async () => {
      try {
        const response = await fetch(`http://3.80.156.123:7999/composite/reviews/order/${order.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch review');
        }
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setRating(data.rating);
          setReview(data.content);
          setExistingReview(data);
        }
      } catch (error) {
        console.error('Error fetching review:', error);
        setError('Failed to fetch review information');
      }
    };

    fetchExistingReview();
  }, [order]);

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = async () => {
    console.log('Current userId:', userId);
    console.log('Current order:', order);

    if (!userId || !order?.id) {
      alert('Missing user or order information');
      console.log('userId:', userId, 'order:', order);
      return;
    }

    if (rating === 0 || review.trim() === '') {
      alert('Please provide a rating and a review.');
      return;
    }

    try {
      const url = 'http://3.80.156.123:7999/composite/reviews/order';
      
      const requestBody = {
        user_id: userId,
        order_id: order.id,
        rating: parseInt(rating, 10),
        content: review.trim(),
        review_type: "service",
        extra: {
          string_durability: "excellent",
          service_speed: "fast"
        }
      };

      console.log('Sending request with body:', requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`Failed to create review: ${response.status}: ${errorData.detail || errorData.message || 'Unknown error'}`);
      }

      const responseData = await response.json();
      console.log('Review submitted successfully:', responseData);

      alert('Review submitted successfully!');
      navigate('/orders', { 
        state: { 
          reviewSubmitted: true, 
          orderId: order.id
        } 
      });
    } catch (error) {
      console.error('Error with review:', error);
      alert(error.message || 'Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="container mx-auto max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-primary-700 mb-4">Write a Review</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">Rate your experience:</h2>
          <div className="flex space-x-2">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleStarClick(index)}
                className={`text-2xl ${index < rating ? 'text-yellow-400' : 'text-neutral-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">Your review:</h2>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="w-full border border-neutral-300 rounded-lg p-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Share your experience..."
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded hover:bg-neutral-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;
