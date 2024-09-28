import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Login from './Login';
import Payment from './Payment';


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
              

            </ul>
          </nav>

          <Routes>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path="/home" element={isLoggedIn? <Home /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} /> {/* 默认重定向 */}
            <Route path="/about" element={<About />} />
            <Route path="/payment" element={<Payment />} />

          </Routes>
        </div>
      </Router>
  );
}

export default App;