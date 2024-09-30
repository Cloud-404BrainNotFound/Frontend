import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setIsLoggedIn}) => {
  const users = [
    { email: 'user1@example.com', password: 'password1' },
    { email: 'user2@example.com', password: 'password2' },
    { email: 'admin@example.com', password: 'admin123' },
  ];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  
  // Email validation
  // Password validation
  // Check if the user exists in the list
  // Set logged-in state in the parent component
  // Redirect to the home page on successful login

  const handleLogin = (e) => {
    e.preventDefault();
    let emailError = '', 
        passwordError = '';

    if (!validateEmail(email)) {
      emailError = 'Please enter a valid email address.';
    }    
    if (password.length < 6) {
      passwordError = 'Password must be at least 6 characters long.';
    }
    if (emailError || passwordError){
      setError({email: emailError, password: passwordError });
    }else{
      const user = users.find(
        (user) => user.email === email && user.password === password
      );
      if (user) {
        setIsLoggedIn(true);
        alert(`Welcome back, ${email}!`);
        navigate('/home');
      } else {
        setError({ email: '', password: 'Invalid email or password.' });
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
            <Link to="forgotpassword" className="text-black text-sm underline font-bold">Forgot your password?</Link>
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
        {/* Remember Field */}
        <div className='flex justify-between items-center mb-4'>
          <div>
            <input
              type ="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(!rememberMe)}
            />
            <label className="text-primary-700 ml-2">Remember me</label>
          </div>
        </div>
        {/* Login Field */}
        <button onClick={handleLogin} className="btn btn-primary w-full">
          Login
        </button>
        {/* Signup Field */}
        <p className="text-primary-700 text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};



export default Login;