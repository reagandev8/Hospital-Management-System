import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
    Users,
    UserPlus,
    Trash2,
    Shield,
    Activity,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import Loader from '../components/Loader';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
    const [doctors, setDoctors] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('doctors');

    // Doctor form state
    const [newDoc, setNewDoc] = useState({
        name: '', email: '', password: '', specialization: '', address: '', city: '', gender: 'Male'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, docRes, userRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getDoctors(),
                adminAPI.getUsers()
            ]);
            setStats(statsRes.data);
            setDoctors(docRes.data);
            setUsers(userRes.data);
        } catch (error) {
            console.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            await adminAPI.addDoctor(newDoc);
            alert('Doctor added successfully!');
            setNewDoc({ name: '', email: '', password: '', specialization: '', address: '', city: '', gender: 'Male' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add doctor');
        }
    };

    const handleDeleteDoc = async (id) => {
        if (window.confirm('Are you sure you want to remove this doctor?')) {
            try {
                await adminAPI.deleteDoctor(id);
                fetchData();
            } catch (error) {
                alert('Failed to delete doctor');
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container page-container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Admin Control Center</h1>
                <p style={{ color: 'var(--text-light)' }}>Global system statistics and management</p>
            </div>

            <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h4 style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Total Patients</h4>
                            <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{stats.patients}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontSize: '0.75rem' }}>
                                <TrendingUp size={14} /> +12% increase
                            </div>
                        </div>
                        <Users size={32} style={{ opacity: 0.2 }} />
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h4 style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Medical Staff</h4>
                            <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{stats.doctors}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontSize: '0.75rem' }}>
                                <TrendingUp size={14} /> +4 active today
                            </div>
                        </div>
                        <Activity size={32} style={{ opacity: 0.2 }} />
                    </div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h4 style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Total Consultations</h4>
                            <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{stats.appointments}</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Since inception</span>
                        </div>
                        <Shield size={32} style={{ opacity: 0.2 }} />
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '0' }}>
                <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', padding: '0 1.5rem' }}>
                    <button
                        onClick={() => setActiveTab('doctors')}
                        style={{ padding: '1rem 0', fontWeight: 600, borderBottom: activeTab === 'doctors' ? '2px solid var(--primary)' : 'none', color: activeTab === 'doctors' ? 'var(--primary)' : 'var(--text-light)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        Manage Doctors
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{ padding: '1rem 0', fontWeight: 600, borderBottom: activeTab === 'users' ? '2px solid var(--primary)' : 'none', color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-light)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        Platform Users
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {activeTab === 'doctors' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                            {/* Doctor List */}
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Registered Doctors</h3>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    {doctors.map(doc => (
                                        <div key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)' }}>
                                                    {doc.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>Dr. {doc.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{doc.specialization}</div>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteDoc(doc._id)} style={{ color: 'var(--danger)', padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add Doctor Form */}
                            <div className="card" style={{ background: '#f8fafc' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <UserPlus size={18} color="var(--primary)" /> Add New Doctor
                                </h3>
                                <form onSubmit={handleAddDoctor} style={{ display: 'grid', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                                        <input type="text" className="input-field" required value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Email</label>
                                        <input type="email" className="input-field" required value={newDoc.email} onChange={e => setNewDoc({ ...newDoc, email: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Password</label>
                                        <input type="password" className="input-field" required value={newDoc.password} onChange={e => setNewDoc({ ...newDoc, password: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Specialization</label>
                                        <input type="text" className="input-field" required value={newDoc.specialization} onChange={e => setNewDoc({ ...newDoc, specialization: e.target.value })} placeholder="e.g. Cardiologist" />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>City</label>
                                            <input type="text" className="input-field" required value={newDoc.city} onChange={e => setNewDoc({ ...newDoc, city: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Gender</label>
                                            <select className="input-field" value={newDoc.gender} onChange={e => setNewDoc({ ...newDoc, gender: e.target.value })}>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Register Doctor</button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Platform Patients</h3>
                            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Patient Name</th>
                                            <th>Email</th>
                                            <th>City</th>
                                            <th>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u._id}>
                                                <td style={{ fontWeight: 500 }}>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>{u.city}</td>
                                                <td style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
