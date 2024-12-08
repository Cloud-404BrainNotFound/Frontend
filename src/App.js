import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth-context';
import Home from './components/Home';
import LandingPage from './components/LandingPage';
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

            </ul>
          </nav>

          <Routes>
            <Route path="/login" element={<Login />} /> 
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<LandingPage />} />
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
  );
}

export default App;