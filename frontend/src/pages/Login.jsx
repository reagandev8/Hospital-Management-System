import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const user = await login(formData);
            navigate(`/${user.role}-dashboard`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container flex-center bg-hospital">
            <div className="card glass-card animate-slide-up" style={{ width: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--primary)', color: 'white', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <LogIn size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Login to your HMS account</p>
                </div>

                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: 'var(--danger)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="email"
                                className="input-field"
                                style={{ paddingLeft: '2.75rem' }}
                                placeholder="name@example.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: '2.75rem' }}
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
