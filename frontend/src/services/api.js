import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add token to headers if it exists
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const authAPI = {
    login: (data) => API.post('/auth/login', data),
    register: (data) => API.post('/auth/register', data),
    getProfile: () => API.get('/auth/profile'),
};

export const appointmentAPI = {
    book: (data) => API.post('/appointments', data),
    getMy: () => API.get('/appointments/my'),
    cancel: (id) => API.put(`/appointments/${id}/cancel`),
    delete: (id) => API.delete(`/appointments/${id}`),
    getDoctors: () => API.get('/appointments/doctors'),
};

export const adminAPI = {
    getUsers: () => API.get('/admin/users'),
    deleteUser: (id) => API.delete(`/admin/users/${id}`),
    getDoctors: () => API.get('/admin/doctors'),
    addDoctor: (data) => API.post('/admin/doctors', data),
    deleteDoctor: (id) => API.delete(`/admin/doctors/${id}`),
    getStats: () => API.get('/admin/stats'),
};

export const doctorAPI = {
    getAppointments: () => API.get('/doctor/appointments'),
    getPatients: () => API.get('/doctor/patients'),
    updateStatus: (id, status) => API.put(`/doctor/appointments/${id}/status`, { status }),
};

export default API;
