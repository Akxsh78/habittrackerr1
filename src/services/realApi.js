import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('habitTrackerToken');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const authAPI = {
    login: (data) => API.post("/auth/login", data),
    logout: () => API.post("/auth/logout"),
    updateProfile: (data) => API.put("/auth/profile", data),
};

export const adminAPI = {
    getUsers: () => API.get("/admin/users"),
};

export const usersAPI = {};

export const habitsAPI = {
    getAll: (filters) => API.get("/habits", { params: filters }),
    create: (data) => API.post("/habits", data),
    update: (id, data) => API.put(`/habits/${id}`, data),
    delete: (id) => API.delete(`/habits/${id}`),
    toggleComplete: (id, data = {}) => {
        if (!data.date) {
            data.date = new Date().toISOString().split('T')[0];
        }
        return API.put(`/habits/${id}`, data);
    },
    getStats: () => API.get("/habits/stats"),
};