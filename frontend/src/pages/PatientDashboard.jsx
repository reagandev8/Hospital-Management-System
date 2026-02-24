import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Trash2,
    User,
    Mail,
    MapPin,
    Calendar,
    Plus,
    Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI } from '../services/api';

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const { data } = await appointmentAPI.getMy();
                setAppointments(data);
            } catch (error) {
                console.error('Failed to fetch appointments');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await appointmentAPI.cancel(id);
                setAppointments(appointments.map(app => app._id === id ? { ...app, status: 'cancelled' } : app));
            } catch (error) {
                alert('Failed to cancel appointment');
            }
        }
    };

    if (loading) return <div className="flex-center" style={{ height: '80vh' }}>Loading Dashboard...</div>;

    return (
        <div className="container page-container">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Patient Dashboard</h1>
                    <p style={{ color: 'var(--text-light)' }}>Welcome back, <span style={{ fontWeight: 600 }}>{user?.name}</span></p>
                </div>
                <button
                    onClick={() => navigate('/book-appointment')}
                    className="btn btn-primary"
                    style={{ height: '48px', padding: '0 1.5rem' }}
                >
                    <Plus size={20} /> Book New Appointment
                </button>
            </div>

            <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <h4 style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Total Bookings</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>{appointments.length}</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <h4 style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Active Visits</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>{appointments.filter(a => a.status === 'active').length}</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <h4 style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Cancelled</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>{appointments.filter(a => a.status === 'cancelled').length}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <section className="card" style={{ padding: '0' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={20} /> Appointment History
                        </h2>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Doctor / Specialist</th>
                                <th>Schedule</th>
                                <th style={{ textAlign: 'center' }}>Status</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length > 0 ? appointments.map((app) => (
                                <tr key={app._id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>Dr. {app.doctor?.name || app.customDoctorName || 'N/A'}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{app.specialization}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{new Date(app.appointmentDate).toDateString()}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{app.appointmentTime}</div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            background: app.status === 'active' ? '#dcfce7' : app.status === 'pending' ? '#fef9c3' : '#fee2e2',
                                            color: app.status === 'active' ? '#166534' : app.status === 'pending' ? '#854d0e' : '#991b1b'
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {(app.status === 'active' || app.status === 'pending') && (
                                            <button
                                                onClick={() => handleCancel(app._id)}
                                                className="btn"
                                                style={{ padding: '0.5rem', color: 'var(--danger)', backgroundColor: '#fef2f2' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '4rem', textAlign: 'center' }}>
                                        <div style={{ color: 'var(--text-light)' }}>No medical appointments found.</div>
                                        <button onClick={() => navigate('/book-appointment')} className="btn btn-outline" style={{ marginTop: '1rem' }}>Book your first appointment</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card">
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>My Profile</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '0.375rem' }}><Mail size={18} color="var(--primary)" /></div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Email Address</div>
                                    <div style={{ fontWeight: 500 }}>{user?.email}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '0.375rem' }}><MapPin size={18} color="var(--primary)" /></div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Living City</div>
                                    <div style={{ fontWeight: 500 }}>{user?.city}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}>
                        <Shield size={32} style={{ marginBottom: '1rem', opacity: 0.8 }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>HIPAA Compliant</h3>
                        <p style={{ opacity: 0.9, fontSize: '0.875rem', marginBottom: '1.5rem' }}>Your medical records are encrypted and secure.</p>
                        <button className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', width: '100%' }}>Manage Records</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PatientDashboard;
