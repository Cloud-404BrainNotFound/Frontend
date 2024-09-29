import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let emailError = '', passwordError = '', confirmPasswordError = '';

    // Email validation
    if (!validateEmail(email)) {
      emailError = 'Please enter a valid email address.';
    }

    // Password validation
    if (password.length < 6) {
      passwordError = 'Password must be at least 6 characters long.';
    }

    // Confirm Password validation
    if (password !== confirmPassword) {
      confirmPasswordError = 'Passwords do not match.';
    }

    if (emailError || passwordError || confirmPasswordError) {
      setError({ email: emailError, password: passwordError, confirmPassword: confirmPasswordError });
    } else {
      setError({ email: '', password: '', confirmPassword: '' });
      // Perform signup logic here (e.g., API call)
      alert('Signup successful! Please log in.');
      navigate('/login'); // Redirect to login page after successful signup
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-6 text-white text-center">Sign up</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-white mb-2">Email</label>
            <input
              type="text"
              className={`w-full px-3 py-2 text-gray-900 bg-gray-100 rounded ${error.email && 'border-red-500'}`}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              className={`w-full px-3 py-2 text-gray-900 bg-gray-100 rounded ${error.password && 'border-red-500'}`}
              placeholder="•••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="block text-white mb-2">Confirm Password</label>
            <input
              type="password"
              className={`w-full px-3 py-2 text-gray-900 bg-gray-100 rounded ${error.confirmPassword && 'border-red-500'}`}
              placeholder="•••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error.confirmPassword && <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn btn-primary px-4 py-2 rounded bg-blue-600 text-white">
            Sign up
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-white text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;