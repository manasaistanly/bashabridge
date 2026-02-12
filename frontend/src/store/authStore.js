import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authAPI.login({ email, password });
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Login failed';
            set({ error: errorMsg, isLoading: false });
            return { success: false, error: errorMsg };
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authAPI.register(userData);
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Registration failed';
            set({ error: errorMsg, isLoading: false });
            return { success: false, error: errorMsg };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null
        });
    },

    fetchProfile: async () => {
        try {
            const response = await authAPI.getProfile();
            set({ user: response.data.data });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    },

    clearError: () => set({ error: null })
}));

export default useAuthStore;
