import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import { Calendar, User, Activity, ChevronRight } from 'lucide-react';
import Loader from '../components/Loader';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        doctorId: '',
        customDoctorName: '',
        specialization: '',
        appointmentDate: '',
        appointmentTime: '',
    });
    const [isCustomDoctor, setIsCustomDoctor] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await appointmentAPI.getDoctors();
                setDoctors(data);
            } catch (error) {
                console.error('Failed to fetch doctors');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleDoctorChange = (docId) => {
        if (docId === 'custom') {
            setIsCustomDoctor(true);
            setFormData({ ...formData, doctorId: '', customDoctorName: '', specialization: '' });
        } else {
            setIsCustomDoctor(false);
            const doc = doctors.find(d => d._id === docId);
            if (doc) {
                setFormData({
                    ...formData,
                    doctorId: docId,
                    customDoctorName: '',
                    specialization: doc.specialization || '',
                });
            } else {
                setFormData({ ...formData, doctorId: '', customDoctorName: '', specialization: '' });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await appointmentAPI.book(formData);
            alert('Appointment confirmed successfully!');
            navigate('/patient-dashboard');
        } catch (error) {
            console.error('Booking error:', error);
            alert(error.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="page-container">
            <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Book an Appointment</h1>
                        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Find and schedule time with our medical staff</p>
                    </div>

                    <div className="card" style={{ padding: '2.5rem' }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="input-label">Select Doctor</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                        <select
                                            className="input-field"
                                            style={{ paddingLeft: '2.75rem' }}
                                            required
                                            value={isCustomDoctor ? 'custom' : formData.doctorId}
                                            onChange={(e) => handleDoctorChange(e.target.value)}
                                        >
                                            <option value="">-- Choose a doctor --</option>
                                            {doctors.map(doc => (
                                                <option key={doc._id} value={doc._id}>Dr. {doc.name} ({doc.specialization})</option>
                                            ))}
                                            <option value="custom">Other (Manual Entry)</option>
                                        </select>
                                    </div>
                                </div>

                                {isCustomDoctor && (
                                    <>
                                        <div className="input-group">
                                            <label className="input-label">Doctor's Name</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                required
                                                placeholder="Dr. Name"
                                                value={formData.customDoctorName}
                                                onChange={(e) => setFormData({ ...formData, customDoctorName: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Specialization</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                required
                                                placeholder="e.g. Surgery"
                                                value={formData.specialization}
                                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}

                                {!isCustomDoctor && (
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label className="input-label">Department / Specialization</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            readOnly
                                            value={formData.specialization}
                                            placeholder="Auto-filled"
                                        />
                                    </div>
                                )}

                                <div className="input-group">
                                    <label className="input-label">Date</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.appointmentDate}
                                        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Preferred Time Slot</label>
                                    <select
                                        className="input-field"
                                        required
                                        value={formData.appointmentTime}
                                        onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                                    >
                                        <option value="">-- Select Time --</option>
                                        {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ gridColumn: 'span 2', marginTop: '1rem' }}
                                    disabled={submitting || (!formData.doctorId && !formData.customDoctorName) || !formData.appointmentTime || !formData.specialization || !formData.appointmentDate}
                                >
                                    {submitting ? 'Confirming...' : 'Book Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
