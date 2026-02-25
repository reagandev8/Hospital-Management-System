import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Shield, Briefcase, Activity, Clock } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const features = [
        { title: 'Easy Booking', desc: 'Schedule appointments with top doctors in seconds.', icon: <Calendar color="var(--primary)" /> },
        { title: 'Expert Doctors', desc: 'Access to a wide range of specialized healthcare professionals.', icon: <Briefcase color="var(--primary)" /> },
        { title: 'Secure Records', desc: 'Your medical history and data are protected with JWT security.', icon: <Shield color="var(--success)" /> },
    ];

    const portals = [
        { name: 'Patient Portal', role: 'patient', icon: <User size={32} />, color: '#2563eb' },
        { name: 'Doctor Portal', role: 'doctor', icon: <Activity size={32} />, color: '#16a34a' },
        { name: 'Admin Portal', role: 'admin', icon: <Shield size={32} />, color: '#4f46e5' },
    ];

    return (
        <div className="page-container bg-hospital" style={{ position: 'relative' }}>
            <div className="hero-overlay"></div>
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '6rem' }}>
                    <h1 className="animate-slide-up" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                        Healthcare Solution for Everyone
                    </h1>
                    <p className="animate-slide-up stagger-1" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', margin: '0 auto 2.5rem', textShadow: '0 1px 5px rgba(0,0,0,0.2)' }}>
                        A comprehensive hospital management solution designed to streamline healthcare
                        and provide an exceptional experience for both patients and medical staff.
                    </p>
                    <div className="animate-slide-up stagger-2" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        {user ? (
                            <button onClick={() => navigate(`/${user.role}-dashboard`)} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                                Go to Dashboard
                            </button>
                        ) : (
                            <>
                                <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                                    Join Now
                                </button>
                                <button onClick={() => navigate('/login')} className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>
                                    Login
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Features */}
                <div className="grid-cols-3" style={{ marginBottom: '6rem' }}>
                    {features.map((f, i) => (
                        <div key={i} className={`card glass-card animate-slide-up stagger-${i + 1}`}>
                            <div style={{ background: '#eff6ff', width: '56px', height: '56px', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                {f.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-light)' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Portal Selection */}
                <section style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 className="animate-slide-up" style={{ fontSize: '2.5rem', marginBottom: '3rem', fontWeight: 700, color: 'white' }}>Choose Your Portal</h2>
                    <div className="grid-cols-3">
                        {portals.map((p, i) => (
                            <div
                                key={i}
                                className={`card glass-card animate-slide-up stagger-${i + 1}`}
                                style={{ padding: '3rem 1.5rem', cursor: 'pointer' }}
                                onClick={() => navigate('/login', { state: { role: p.role } })}
                            >
                                <div style={{ color: p.color, marginBottom: '1.5rem' }}>
                                    {p.icon}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{p.name}</h3>
                                <p style={{ marginTop: '1rem', color: 'var(--text-light)', fontSize: '0.925rem' }}>
                                    Access for {p.role}s to manage health records and tasks.
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Info */}
                <div style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={18} /> 24/7 Support
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={18} /> Live Monitoring
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={18} /> Data Privacy
                        </div>
                    </div>
                    <p style={{ marginTop: '2rem', opacity: 0.5, fontSize: '0.75rem' }}>
                        © 2024 Hospital Management System. All Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
