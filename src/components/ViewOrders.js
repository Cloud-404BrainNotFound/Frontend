import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [orderReviews, setOrderReviews] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { reviewSubmitted, orderId } = location.state || {};

  const sportEmojis = {
    Tennis: '🎾',
    Badminton: '🏸',
    Squash: '⚫️',
  };

  const fetchOrderReviews = async (orders) => {
    try {
      // First, load from localStorage
      const cachedReviews = JSON.parse(localStorage.getItem('orderReviews') || '{}');
      setOrderReviews(cachedReviews);

      const reviewPromises = orders.map(order => 
        fetch(`http://3.80.156.123:7999/composite/reviews/order/${order.id}`)
          .then(response => response.json())
          .then(data => ({
            orderId: order.id,
            hasReview: Array.isArray(data) ? data.length > 0 : (data && data.review)
          }))
          .catch(error => {
            console.error('Error fetching review for order:', order.id, error);
            return { orderId: order.id, hasReview: false };
          })
      );

      const results = await Promise.all(reviewPromises);
      const reviewStatuses = {};
      results.forEach(({ orderId, hasReview }) => {
        reviewStatuses[orderId] = hasReview;
      });
      
      setOrderReviews(reviewStatuses);
      localStorage.setItem('orderReviews', JSON.stringify(reviewStatuses));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchOrders = React.useCallback(async () => {
    try {
      const userId = localStorage.getItem('user_id');
      console.log('Current userId from localStorage:', userId);
      
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }
      
      const response = await fetch(`http://3.80.156.123:7999/composite/orders/user/${userId}`);
      const data = await response.json();
      console.log('API Response:', data);
      console.log('Orders:', data.orders);
      const sortedOrders = data.orders.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setOrders(sortedOrders);
      await fetchOrderReviews(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (reviewSubmitted) {
      const newReviews = {
        ...JSON.parse(localStorage.getItem('orderReviews') || '{}'),
        [orderId]: true
      };
      setOrderReviews(newReviews);
      localStorage.setItem('orderReviews', JSON.stringify(newReviews));
      fetchOrders();
    }
  }, [reviewSubmitted, orderId, fetchOrders]);

  useEffect(() => {
    console.log('Current orderReviews state:', orderReviews);
  }, [orderReviews]);

  const handleWriteReview = (order) => {
    console.log('Writing review for order:', order.id);
    navigate(`/write-review/${order.id}`, {
      state: { 
        order: {
          id: order.id,
          sport: order.sport,
          racket_model: order.racket_model,
          string: order.string,
          tension: order.tension,
        }
      }
    });
  };

  const handleViewReview = (order) => {
    if (!localStorage.getItem('user_id')) {
      console.error('User not logged in');
      navigate('/login');
      return;
    }

    navigate(`/view-review/${order.id}`, {
      state: { 
        orderId: order.id,
        order: {
          id: order.id,
          sport: order.sport,
          racket_model: order.racket_model,
          string: order.string,
          tension: order.tension,
        }
      }
    });
  };

  // Calculate pagination values
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-primary-700 mb-6">Your Orders</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-lg rounded-lg text-lg">
            <thead className="bg-primary-100">
              <tr>
                <th className="px-6 py-4 text-left text-primary-800">Date</th>
                <th className="px-6 py-4 text-left text-primary-800">Sport</th>
                <th className="px-6 py-4 text-left text-primary-800">Racket</th>
                <th className="px-6 py-4 text-left text-primary-800">String</th>
                <th className="px-6 py-4 text-left text-primary-800">Tension</th>
                <th className="px-6 py-4 text-left text-primary-800">Pickup Date</th>
                <th className="px-6 py-4 text-left text-primary-800">Payment</th>
                <th className="px-6 py-4 text-left text-primary-800">Status</th>
                <th className="px-6 py-4 text-left text-primary-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-6 py-4 text-neutral-700">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-neutral-700">
                    <span className="inline-flex items-center">
                      {sportEmojis[order.sport]} {order.sport}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-700">{order.racket_model}</td>
                  <td className="px-6 py-4 text-neutral-700">{order.string}</td>
                  <td className="px-6 py-4 text-neutral-700">{order.tension}</td>
                  <td className="px-6 py-4 text-neutral-700">
                    {new Date(order.pickup_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-neutral-700">
                    ${order.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-neutral-700">
                    {order.order_status === 'strung' ? 'Complete' : order.order_status}
                  </td>
                  <td className="px-6 py-4 text-neutral-700">
                    <button
                      onClick={() => orderReviews[order.id] ? handleViewReview(order) : handleWriteReview(order)}
                      className={`px-6 py-3 rounded text-lg hover:bg-primary-600 
                        ${orderReviews[order.id] 
                          ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' 
                          : 'bg-primary-500 text-white'}`}
                    >
                      {orderReviews[order.id] ? 'View Review' : 'Write Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-3 text-lg bg-primary-500 text-white rounded hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-6 py-3 rounded text-lg ${
                  currentPage === index + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-3 text-lg bg-primary-500 text-white rounded hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;
