import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth-context';
import LandingPage from './components/LandingPage';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import Payment from './Payment';
import PaymentSummary from './components/PaymentSummary';
import StringingOrder from './components/StringingOrder';
import ProfilePage from './components/ProfilePage';
import ViewOrders from './components/ViewOrders';
import WriteReview from './components/WriteReview';

const App = () => {
  const orders = [
    {
      id: 1,
      date: "2024-12-10",
      sport: "Badminton",
      racket: "Yonex Astrox 99 Pro",
      string: "BG65",
      tension: "26 lbs",
      pickupDate: "2024-12-15",
      paymentStatus: "Paid",
      status: "Completed",
    },
    {
      id: 2,
      date: "2024-12-08",
      sport: "Tennis",
      racket: "Babolat Pure Drive",
      string: "RPM Blast",
      tension: "50 lbs",
      pickupDate: "2024-12-12",
      paymentStatus: "Pending",
      status: "In Progress",
    },
    {
      id: 3,
      date: "2024-12-06",
      sport: "Squash",
      racket: "Dunlop Hyperfibre XT",
      string: "X-Life",
      tension: "30 lbs",
      pickupDate: "2024-12-10",
      paymentStatus: "Paid",
      status: "Completed",
    },
  ];

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    avatar: '',
    completedOrders: 5,
    pendingOrders: 2,
    canceledOrders: 1,
  };

  // Mock recent orders
  const recentOrders = [
    { date: "2024-12-10", racket: "Yonex Astrox 99 Pro", string: "BG65", status: "Completed" },
    { date: "2024-12-08", racket: "Babolat Pure Drive", string: "RPM Blast", status: "In Progress" }
  ];

  // Mock notifications
  const notifications = [
    { message: "Your order has been completed!" },
    { message: "A new stringing order is available!" }
  ];

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <nav className="bg-base-100">
            <ul className="menu menu-horizontal px-1">
              <li><Link to="/">Landing Page</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/profile"
              element={<ProfilePage user={user} recentOrders={recentOrders} notifications={notifications} />}
            />
            <Route
              path="/orders"
              element={<ViewOrders orders={orders} />}
            />
            <Route
              path="/write-review/:orderId"
              element={<WriteReview />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-summary" element={<PaymentSummary />} />
            <Route path="/stringing-order" element={<StringingOrder />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
