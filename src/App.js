import React from 'react';  // 移除 useState 导入
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth-context';  // 添加 useAuth 导入
import Home from './components/Home';
import LandingPage from './components/LandingPage';  // Correct import of LandingPage
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import Payment from './Payment';
import PaymentSummary from './components/PaymentSummary';
import StringingOrder from './components/StringingOrder';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <nav className="bg-base-100">
            <ul className="menu menu-horizontal px-1">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/payment">Payment</Link></li>
              <li><Link to="/stringing-order">Stringing Order</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="/login" element={<Login />} /> 
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route path="/about" element={<About />} />
            <Route 
              path="/payment" 
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment-summary" 
              element={
                <ProtectedRoute>
                  <PaymentSummary />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/stringing-order" 
              element={
                <ProtectedRoute>
                  <StringingOrder />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">

        {/* Navigation bar */}
        <nav className="bg-base-100">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/payment">Payment</Link></li>
            <li><Link to="/stringing-order">Stringing Order</Link></li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          {/* Login and Signup pages */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/signup" element={<Signup />} />

          {/* Home Page, only accessible if logged in */}
          <Route path="/home" element={isLoggedIn ? <LandingPage /> : <Navigate to="/landing" />} /> 

          {/* Other pages */}
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-summary" element={<PaymentSummary />} />
          <Route path="/stringing-order" element={<StringingOrder />} />

          {/* Landing Page (for non-logged-in users) */}
          <Route path="/landing" element={<LandingPage />} />

          {/* Default route */}
          <Route path="*" element={<Navigate to="/landing" />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;