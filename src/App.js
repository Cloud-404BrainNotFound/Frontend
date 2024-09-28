import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Login from './Login';
import Payment from './Payment';
import PaymentSummary from './PaymentSummary'; // Import your summary component
import StringingOrder from './StringingOrder';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
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
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path="/home" element={isLoggedIn? <Home /> : <Navigate to="/login" />} />
            <Route path="/about" element={<About />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-summary" element={<PaymentSummary />} /> {/* New route */}
            <Route path="/stringing-order" element={<StringingOrder />} />
            <Route path="*" element={<Navigate to="/login" />} /> {/* 默认重定向 */}
          </Routes>

        </div>
      </Router>
  );
}

export default App;
