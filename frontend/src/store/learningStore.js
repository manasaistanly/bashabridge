import { create } from 'zustand';
import { languageAPI, phraseAPI } from '../services/api';

const useLearningStore = create((set, get) => ({
    selectedLanguage: null,
    selectedSituation: null,
    situations: [],
    phrases: [],
    currentPhraseIndex: 0,
    isLoading: false,
    error: null,

    setLanguage: (language) => {
        set({ selectedLanguage: language, selectedSituation: null, phrases: [] });
    },

    fetchSituations: async (languageId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await languageAPI.getSituations(languageId);
            set({ situations: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    setSituation: (situation) => {
        set({ selectedSituation: situation, currentPhraseIndex: 0 });
    },

    fetchPhrases: async (languageId, situation) => {
        set({ isLoading: true, error: null });
        try {
            const response = await phraseAPI.getByLanguageAndSituation(languageId, situation);
            set({ phrases: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    nextPhrase: () => {
        const { currentPhraseIndex, phrases } = get();
        if (currentPhraseIndex < phrases.length - 1) {
            set({ currentPhraseIndex: currentPhraseIndex + 1 });
        }
    },

    previousPhrase: () => {
        const { currentPhraseIndex } = get();
        if (currentPhraseIndex > 0) {
            set({ currentPhraseIndex: currentPhraseIndex - 1 });
        }
    },

    getCurrentPhrase: () => {
        const { phrases, currentPhraseIndex } = get();
        return phrases[currentPhraseIndex];
    }
}));

export default useLearningStore;
