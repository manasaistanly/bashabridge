import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { languageAPI, phraseAPI } from '../services/api';

const useLearningStore = create(
    persist(
        (set, get) => ({
            selectedLanguage: null,
            selectedSituation: null,
            languages: [],
            situations: [],
            phrases: [],
            currentPhraseIndex: 0,
            isLoading: false,
            error: null,

            setLanguage: (language) => {
                set({ selectedLanguage: language, selectedSituation: null, phrases: [] });
            },

            fetchLanguages: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await languageAPI.getAll();
                    set({ languages: response.data.data, isLoading: false });
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                }
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
        }),
        {
            name: 'bhashabridge-learning',
            partialize: (state) => ({ selectedLanguage: state.selectedLanguage }),
        }
    )
);

export default useLearningStore;
