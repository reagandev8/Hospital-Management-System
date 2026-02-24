import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Activity, Bell } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            padding: '1rem 5%',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--white)',
            borderBottom: '1px solid var(--border)'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.5rem', color: 'var(--primary)', textDecoration: 'none' }}>
                <Activity size={24} />
                <span>HMS</span>
            </Link>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ position: 'relative', color: 'var(--text-light)', cursor: 'pointer' }}>
                            <Bell size={20} />
                            <span style={{ position: 'absolute', top: -2, right: -2, background: 'var(--danger)', width: '8px', height: '8px', borderRadius: '50%', border: '1px solid white' }}></span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                                {user.name.charAt(0)}
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.875rem' }}>
                                {user.role === 'doctor' ? `Dr. ${user.name}` : user.name}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="btn btn-outline"
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: 500 }}>Log In</Link>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>Get Started</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
