import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let emailError = '', 
        passwordError = '';

    if (!validateEmail(email)) {
      emailError = 'Please enter a valid email address.';
    }    
    if (password.length < 6) {
      passwordError = 'Password must be at least 6 characters long.';
    }
    if (rememberMe) {
      localStorage.setItem("email", email);
    }

    if (emailError || passwordError) {
      setError({ email: emailError, password: passwordError });
    } else {
      try {
        const formData = new URLSearchParams();  // needs to be in form object
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch('http://localhost:8000/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(), // Convert to string for URL encoding
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Login failed');
        }

        const data = await response.json();
        setIsLoggedIn(true);
        alert(`Welcome back, ${data.email}!`);
        navigate('/home');
      } catch (error) {
        setError({ email: '', password: error.message });
        alert('Invalid username or password. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary-800">Login</h2>
        
        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-primary-700 text-sm font-semibold mb-2">Email</label>
          <input
            type="text"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered input-primary w-full"
          />
          {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <div className="flex justify-between items-center"> 
            <label className="block text-primary-700 text-sm font-semibold mb-2">Password</label>
            <Link to="/forgotpassword" className="text-black text-sm underline font-bold">Forgot your password?</Link>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered input-primary w-full"
          />
          {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
        </div>

        {/* Remember Me Field */}
        <div className='flex justify-between items-center mb-4'>
          <div>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label className="text-primary-700 ml-2">Remember me</label>
          </div>
        </div>

        {/* Login Button */}
        <button onClick={handleLogin} className="btn btn-primary w-full">
          Login
        </button>

        {/* Signup Link */}
        <p className="text-primary-700 text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
