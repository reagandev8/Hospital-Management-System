import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Calendar,
    Clock,
    Activity,
    Stethoscope,
    User,
    Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doctorAPI } from '../services/api';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appRes, patRes] = await Promise.all([
                doctorAPI.getAppointments(),
                doctorAPI.getPatients()
            ]);
            setAppointments(appRes.data);
            setPatients(patRes.data);
        } catch (error) {
            console.error('Failed to fetch doctor data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await doctorAPI.updateStatus(id, status);
            fetchData();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="flex-center" style={{ height: '80vh' }}>Loading Console...</div>;

    const activeCount = appointments.filter(a => a.status === 'active').length;

    return (
        <div className="container page-container">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Doctor Console</h1>
                    <p style={{ color: 'var(--text-light)' }}>
                        You have <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{activeCount} active sessions</span> scheduled for today.
                    </p>
                </div>
            </div>

            <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <Users size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h4 style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Total Patients</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>{patients.length}</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <Calendar size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h4 style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Total Appointments</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>{appointments.length}</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <Activity size={24} color="var(--success)" style={{ marginBottom: '1rem' }} />
                    <h4 style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Next Session Slot</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>09:00 AM</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Appointments Table */}
                <section className="card" style={{ padding: '0' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={20} /> Upcoming Appointments
                        </h2>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Date & Time</th>
                                <th style={{ textAlign: 'center' }}>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((app) => (
                                <tr key={app._id}>
                                    <td style={{ fontWeight: 600 }}>{app.patient?.name}</td>
                                    <td>
                                        <div>{new Date(app.appointmentDate).toDateString()}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{app.appointmentTime}</div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            background: app.status === 'active' ? '#dcfce7' : app.status === 'pending' ? '#fef9c3' : '#e0f2fe',
                                            color: app.status === 'active' ? '#166534' : app.status === 'pending' ? '#854d0e' : '#0369a1'
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {app.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'active')}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                >
                                                    Accept
                                                </button>
                                            )}
                                            {app.status === 'active' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'completed')}
                                                    className="btn"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534' }}
                                                >
                                                    Complete
                                                </button>
                                            )}
                                            {(app.status === 'active' || app.status === 'pending') && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'cancelled')}
                                                    className="btn"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b' }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Patients List Sidebar */}
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={20} /> My Patients
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {patients.map((p) => (
                            <div key={p._id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <User size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Mail size={12} /> {p.email}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{p.city}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DoctorDashboard;
