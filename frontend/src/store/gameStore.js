import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useGameStore = create((set, get) => ({
    achievements: [],
    userAchievements: [],
    dailyChallenge: null,
    challengeProgress: 0,
    newlyUnlocked: [],

    fetchAchievements: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/achievements`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ achievements: response.data.data });
        } catch (error) {
            console.error('Failed to fetch achievements:', error);
        }
    },

    fetchDailyChallenge: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/challenges/today`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({
                dailyChallenge: response.data.data.challenge,
                challengeProgress: response.data.data.progress
            });
        } catch (error) {
            console.error('Failed to fetch daily challenge:', error);
        }
    },

    updateChallengeProgress: async (challengeId, increment = 1) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/challenges/progress`,
                { challengeId, increment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.data.completed) {
                set({ challengeProgress: response.data.data.progress });
                // Refresh challenge to show completion
                get().fetchDailyChallenge();
            } else {
                set({ challengeProgress: response.data.data.progress });
            }
        } catch (error) {
            console.error('Failed to update challenge progress:', error);
        }
    },

    addNewlyUnlocked: (achievement) => {
        set(state => ({ newlyUnlocked: [...state.newlyUnlocked, achievement] }));
    },

    clearNewlyUnlocked: () => {
        set({ newlyUnlocked: [] });
    },

    triggerLevelUp: () => set({ showLevelUp: true }),
    dismissLevelUp: () => set({ showLevelUp: false })
}));

export default useGameStore;
