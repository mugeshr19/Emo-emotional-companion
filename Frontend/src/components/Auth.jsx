import React, { useState } from 'react';

const Auth = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/login' : '/signin';
            const payload = isLogin 
                ? { email: formData.email, password: formData.password }
                : formData;

            const apiUrl = process.env.REACT_APP_API_URL || 'https://emo-emotional-companion.onrender.com';
            const response = await fetch(`${apiUrl}/api/chat${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onAuthSuccess(data.token, data.user);
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "Roboto, sans-serif",
            background: "linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 50%, #1E1E1E 100%)",
            padding: "1rem",
            boxSizing: "border-box"
        }}>
            <div style={{
                backgroundColor: "#2D2D2D",
                padding: "2rem",
                borderRadius: "1rem",
                border: "1px solid #4CAF50",
                width: "100%",
                maxWidth: "400px",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.2)",
                boxSizing: "border-box"
            }}>
                <h2 style={{
                    color: "#FFFFFF",
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    fontSize: "1.5rem",
                    margin: "0 0 1.5rem 0"
                }}>
                    {isLogin ? 'Welcome Back' : 'Create an Account'}
                </h2>

                {error && (
                    <div style={{
                        color: "#FF5722",
                        backgroundColor: "#2D1B1B",
                        padding: "10px",
                        borderRadius: "5px",
                        marginBottom: "20px",
                        textAlign: "center"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                marginBottom: "1rem",
                                borderRadius: "0.5rem",
                                border: "1px solid #4CAF50",
                                backgroundColor: "#1E1E1E",
                                color: "#FFFFFF",
                                fontSize: "1rem",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />
                    )}
                    
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            marginBottom: "1rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #4CAF50",
                            backgroundColor: "#1E1E1E",
                            color: "#FFFFFF",
                            fontSize: "1rem",
                            outline: "none",
                            boxSizing: "border-box"
                        }}
                    />
                    
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            marginBottom: "1.5rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #4CAF50",
                            backgroundColor: "#1E1E1E",
                            color: "#FFFFFF",
                            fontSize: "1rem",
                            outline: "none",
                            boxSizing: "border-box"
                        }}
                    />
                    
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            backgroundColor: "#4CAF50",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "0.5rem",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                            boxSizing: "border-box"
                        }}
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <p style={{
                    color: "#FFFFFF",
                    textAlign: "center",
                    marginTop: "1.5rem",
                    fontSize: "0.9rem"
                }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            color: "#4CAF50",
                            cursor: "pointer",
                            textDecoration: "underline"
                        }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;