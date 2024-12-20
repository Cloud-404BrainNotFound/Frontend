import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    // Name validation 
    // Email validation 
    // Password validation 
    // Password confirmation
    // Make a POST request to the FastAPI backend
    // Redirect to the login page on successful signup

    const handleSignup = async(e) => {
        e.preventDefault();
        let usernameError = '',
            emailError = '', 
            passwordError = '', 
            confirmPasswordError = '';
        
        // 验证部分保持不变...
        
        if (usernameError || emailError || passwordError || confirmPasswordError) {
            setError({username: usernameError, email: emailError, password: passwordError, confirmPassword: confirmPasswordError});
        } else {
            setError({username: '', email: '', password: '', confirmPassword: ''});
            setLoading(true); // 添加加载状态
    
            try {
                const response = await axios.post('http://localhost:8000/users/signup', {
                    username,
                    email,
                    password,
                    role: 'customer'
                });
    
                console.log('Signup response:', response.data); // 添加调试日志
                
                if (response.data.message === "User created successfully") {
                    alert('Signup successful! Please Sign in.');
                    navigate('/login');
                }
    
            } catch (err) {
                console.error('Signup error:', err); // 更详细的错误日志
                
                if (err.response?.data?.detail) {
                    // 处理特定的错误消息
                    if (err.response.data.detail === "Email is already registered") {
                        setError({ ...error, email: 'This email is already registered.' });
                    } else {
                        setError({ ...error, email: err.response.data.detail });
                    }
                } else {
                    setError({ ...error, email: 'Signup failed. Please try again.' });
                }
            } finally {
                setLoading(false); // 结束加载状态
            }    
        }
    };


    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary-800">Sign up</h2>
            
            {/* Name Field*/}
            <div className="mb-4">
                <label className="block text-primary-700 text-sm font-semibold mb-2">Full Name</label>
                <input 
                    type="text"
                    placeholder="Firstname Lastname"
                    value ={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input input-bordered input-primary w-full"
                />
                {error.username && <p className="text-red-500 text-sm mt-1">{error.username}</p>}
            </div>

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

            {/* Confirmation Field */}
            <div className="mb-4">
                <label className="block text-primary-700 text-sm font-semibold mb-2">Confirm Password</label>
                <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input input-bordered input-primary w-full"
                />
                {error.confirmPassword && <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>}
            </div>

            {/* Login Field */}
            <button 
                onClick={handleSignup} 
                className="btn btn-primary w-full"
                disabled={loading}
            >
                {loading ? 'Signing up...' : 'Sign up'}
            </button>

            {/* Signup Field */}
            <p className="text-primary-700 text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 underline">Sign in</Link>
            </p>
        </div>
        </div>
    );
};

export default Signup;