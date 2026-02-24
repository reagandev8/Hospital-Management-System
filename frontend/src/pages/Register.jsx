import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, MapPin, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        gender: 'Male',
        address: '',
        city: '',
        role: 'patient',
        specialization: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const user = await register(formData);
            navigate(`/${user.role}-dashboard`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Email might be taken.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container flex-center">
            <div className="card" style={{ width: '600px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Create Account</h2>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Join the HMS healthcare network</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        type="button"
                        className={`btn ${formData.role === 'patient' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFormData({ ...formData, role: 'patient' })}
                        style={{ flex: 1 }}
                    >
                        As Patient
                    </button>
                    <button
                        type="button"
                        className={`btn ${formData.role === 'doctor' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFormData({ ...formData, role: 'doctor' })}
                        style={{ flex: 1 }}
                    >
                        As Doctor
                    </button>
                </div>

                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: 'var(--danger)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label className="input-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ paddingLeft: '2.75rem' }}
                                placeholder="Full Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="email"
                                className="input-field"
                                style={{ paddingLeft: '2.75rem' }}
                                placeholder="email@example.com"
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

                    {formData.role === 'doctor' && (
                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label className="input-label">Specialization</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g. Cardiologist"
                                required
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">Gender</label>
                        <select
                            className="input-field"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">City</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ paddingLeft: '2.75rem' }}
                                placeholder="City"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label className="input-label">Address</label>
                        <textarea
                            className="input-field"
                            style={{ minHeight: '80px' }}
                            placeholder="Full Address"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ gridColumn: 'span 2', marginTop: '1rem' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating account...' : `Register as ${formData.role === 'doctor' ? 'Doctor' : 'Patient'}`}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
