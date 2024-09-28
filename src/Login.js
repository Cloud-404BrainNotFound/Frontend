import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn}) => {
  const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    { username: 'admin', password: 'admin123' },
  ];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      alert('Login Successful: Welcome, ' + username + '!');
      navigate('/home');
    } else {
      setError('Login Failed: Invalid username or password.');
      alert('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary-800">Login</h2>
        <div className="mb-4">
          <label className="block text-primary-700 text-sm font-semibold mb-2">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered input-primary w-full"
          />
        </div>
        <div className="mb-6">
          <label className="block text-primary-700 text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered input-primary w-full"
          />
        </div>
        <button
          onClick={handleLogin}
          className="btn btn-primary w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
};



export default Login;


