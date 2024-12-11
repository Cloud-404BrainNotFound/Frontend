import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth-context';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedUserId = localStorage.getItem('user_id');
    const storedUsername = localStorage.getItem('username');

    if (!isAuthenticated() || !storedEmail || !storedUserId || !storedUsername) {
      navigate('/login');
      return;
    }

    setUserData({
      name: storedUsername,
      email: storedEmail,
      userId: storedUserId,
      completedOrders: 0,
      pendingOrders: 0,
      canceledOrders: 0
    });

    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`http://3.80.156.123:7999/composite/orders/user/${userId}`);
        const data = await response.json();
        
        const ordersList = data.orders;
        setOrders(ordersList);
        
        const completedCount = ordersList.filter(order => order.order_status === 'strung').length;
        const pendingCount = ordersList.filter(order => order.order_status === 'pending').length;
        const canceledCount = ordersList.filter(order => order.order_status === 'canceled').length;

        setUserData(prev => ({
          ...prev,
          completedOrders: completedCount,
          pendingOrders: pendingCount,
          canceledOrders: canceledCount
        }));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [navigate, isAuthenticated]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="container mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto text-center">
          {/* Avatar */}
          <img
            src={userData.avatar || "https://via.placeholder.com/100"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          {/* Name */}
          <h1 className="text-2xl font-bold text-primary-700">{userData.name}</h1>
          {/* Email */}
          <p className="text-neutral-600 mt-1 mb-4">{userData.email}</p>
          
          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4 mb-6 mt-6">
            <Link
              to="/stringing-order"
              className="py-4 text-center bg-primary-500 text-white font-semibold rounded hover:bg-primary-600"
            >
              Create Order
            </Link>
            <Link
              to="/orders"
              className="py-4 text-center bg-accent-500 text-white font-semibold rounded hover:bg-accent-600"
            >
              View Orders
            </Link>
          </div>

          {/* Profile Settings */}
          <Link
            to="/profile-settings"
            className="block w-full text-center py-2 px-4 bg-secondary-500 text-white font-semibold rounded hover:bg-secondary-600"
          >
            Edit Profile Settings
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="mt-8 p-6 bg-neutral-100 rounded shadow max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-neutral-600 mb-4">Your Stats</h2>
          <div className="grid grid-cols-3 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-500">{userData?.completedOrders || 0}</p>
              <p className="text-sm text-neutral-500">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-500">{userData?.pendingOrders || 0}</p>
              <p className="text-sm text-neutral-500">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-500">{userData?.canceledOrders || 0}</p>
              <p className="text-sm text-neutral-500">Canceled</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-primary-600 mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            {orders
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 4)
              .map((order, index) => (
                <li key={index} className="border p-4 rounded shadow bg-white">
                  <p className="text-sm text-neutral-700">
                    {new Date(order.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}: {order.racket_model} - {order.string} ({order.order_status})
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
