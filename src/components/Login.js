import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './auth-context';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);


  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  //Remeber me 
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Google login
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse
        });
        setGoogleLoaded(true);
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  useEffect(() => {
    if (googleLoaded) {
      window.google.accounts.id.renderButton(
        document.getElementById('googleButton'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, [googleLoaded]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      setError({ email: '', password: '', general: '' });

      const resp = await fetch('http://127.0.0.1:8080/api/users/login/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          google_token: response.credential
        })
      });

      const data = await resp.json();
      console.log('Token received:', data.access_token);

      if (!resp.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      if (data.message === "Login successful" && data.access_token) {
        const token = String(data.access_token);
        login(token);
        localStorage.setItem('user_id', data.user_id);
        
        try {
          await fetchUserDetails(data.user_id, token);
          console.log('localStorage after Google login:', { ...localStorage });
          navigate('/profile', { replace: true });
        } catch (error) {
          console.error('Error fetching user details:', error);
          navigate('/profile', { replace: true });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError({ email: '', password: '', general: error.message });
    } finally {
      setLoading(false);
    }
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
    } else {
      localStorage.removeItem("email");
    }

    if (emailError || passwordError) {
      setError({ email: emailError, password: passwordError });
    } else {
      try {
        setLoading(true);
        setError({ email: '', password: '', general: '' });

        const formData = new URLSearchParams();  // needs to be in form object
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch('http://localhost:8080/api/users/login/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(), // Convert to string for URL encoding
        });
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }

        if (data.message === "Login successful") {
          const token = String(data.access_token).trim();
          console.log('Token received:', token); // Debug log
          
          login(token);
          localStorage.setItem('user_id', data.user_id);
          
          try {
            await fetchUserDetails(data.user_id, token);
            console.log('localStorage after email login:', { ...localStorage });
          } catch (error) {
            console.error('Error fetching user details:', error);
            setError({ general: 'Failed to fetch user details' });
            return;
          }
          
          navigate('/profile', { replace: true });
        }
      } catch (error) {
        setError({ 
          email: '', 
          password: '', 
          general: 'Invalid username or password. Please try again.' 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchUserDetails = async (userId, token) => {
    if (!userId || !token) {
      console.error('Missing userId or token:', { userId, token });
      throw new Error('Missing userId or token');
    }

    const headers = {
      'Authorization': `Bearer ${String(token).trim()}`,
      'Accept': 'application/json'
    };
    
    try {
      const emailResponse = await fetch(`http://localhost:8080/api/users/${userId}/email`, {
        headers: headers
      });
      
      if (!emailResponse.ok) {
        const errorData = await emailResponse.text();
        console.error('Server response:', errorData);
        throw new Error(`Email fetch failed: ${emailResponse.status} - ${errorData}`);
      }
      
      const emailData = await emailResponse.json();
      console.log('Email data received:', emailData);
      
      if (!emailData.email) {
        throw new Error('Email is undefined in response');
      }
      
      localStorage.setItem('email', emailData.email);
      localStorage.setItem('user_id',emailData. user_id);
      localStorage.setItem('username', emailData.username);
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img 
            src="/img/sslogo.png"
            alt="SwingSwift Logo"
            className="h-20"
          />
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-primary-800">Login to your Account</h2>
        
        {error.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error.general}
          </div>
        )}
        
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-primary-700 text-sm font-semibold mb-2">Email</label>
          <input
            type="text"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered input-primary w-full"
            disabled={loading}
          />
          {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <div className="flex justify-between items-center"> 
            <label className="block text-primary-700 text-sm font-semibold mb-2">
              Password
            </label> 
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered input-primary w-full"
            disabled={loading}
          />
          {error.password && (
            <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
        </div>

        {/* Remember Me Field */}
        <div className='flex justify-between items-center mb-4'>
          <div>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              disabled={loading}
              className="checkbox checkbox-primary"
            />
            <label className="text-primary-700 ml-2">Remember me</label>
          </div>
        </div>

        {/* Login Button */}
        <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
      </form>

        {/* Google Login Button */}
        <div className="mt-4">
            <div className="relative flex items-center justify-center my-4">
              <hr className="w-full border-gray-300" />
              <span className="absolute bg-white px-4 text-gray-500 text-sm">
                Or continue with
              </span>
            </div>
            <div 
              id="googleButton"
              className="flex justify-center"
            />
          </div>

        {/* Signup Link */}
        <p className="text-primary-700 text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
