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
      const reviewStatuses = {};
      for (const order of orders) {
        const response = await fetch(`http://3.80.156.123:7999/composite/reviews/order/${order.id}`);
        const data = await response.json();
        reviewStatuses[order.id] = data;
      }
      setOrderReviews(reviewStatuses);
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
      setOrders(data.orders);
      await fetchOrderReviews(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (reviewSubmitted) {
      console.log(`Review ${location.state?.isUpdate ? 'updated' : 'submitted'} for order ${orderId}`);
      fetchOrders();
    }
  }, [reviewSubmitted, orderId, fetchOrders, location.state?.isUpdate]);

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
          // Include any other order details you want to display in the review page
        }
      }
    });
  };

  const handleViewReview = (order) => {
    navigate('/view-reviews', {
      state: { 
        orderId: order.id,
        order: {
          sport: order.sport,
          racket_model: order.racket_model,
          string: order.string,
          tension: order.tension,
          // Add any other order details you want to pass
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
        <h1 className="text-2xl font-bold text-primary-700 mb-6">Your Orders</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-lg rounded-lg">
            <thead className="bg-primary-100">
              <tr>
                <th className="px-4 py-2 text-left text-primary-800">Date</th>
                <th className="px-4 py-2 text-left text-primary-800">Sport</th>
                <th className="px-4 py-2 text-left text-primary-800">Racket</th>
                <th className="px-4 py-2 text-left text-primary-800">String</th>
                <th className="px-4 py-2 text-left text-primary-800">Tension</th>
                <th className="px-4 py-2 text-left text-primary-800">Pickup Date</th>
                <th className="px-4 py-2 text-left text-primary-800">Payment</th>
                <th className="px-4 py-2 text-left text-primary-800">Status</th>
                <th className="px-4 py-2 text-left text-primary-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-2 text-neutral-700">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-neutral-700">
                    <span className="inline-flex items-center">
                      {sportEmojis[order.sport]} {order.sport}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-neutral-700">{order.racket_model}</td>
                  <td className="px-4 py-2 text-neutral-700">{order.string}</td>
                  <td className="px-4 py-2 text-neutral-700">{order.tension}</td>
                  <td className="px-4 py-2 text-neutral-700">
                    {new Date(order.pickup_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-neutral-700">
                    ${order.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-neutral-700">
                    {order.order_status}
                  </td>
                  <td className="px-4 py-2 text-neutral-700">
                    <button
                      onClick={() => orderReviews[order.id] ? handleViewReview(order) : handleWriteReview(order)}
                      className="px-4 py-2 bg-primary-500 text-white rounded"
                    >
                      {orderReviews[order.id] ? 'View Review' : 'Write Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded ${
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
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
