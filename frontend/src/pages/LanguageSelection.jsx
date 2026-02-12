import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useLearningStore from '../store/learningStore';
import { languageAPI } from '../services/api';

export default function LanguageSelection() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { setLanguage, fetchSituations } = useLearningStore();

    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLanguages();
    }, []);

    const loadLanguages = async () => {
        try {
            const response = await languageAPI.getAll();
            setLanguages(response.data.data);
        } catch (error) {
            console.error('Failed to load languages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageSelect = async (language) => {
        setLanguage(language);
        await fetchSituations(language._id);
        navigate('/learn');
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-primary-600">🌏 BhashaBridge</h1>
                        <p className="text-sm text-gray-600">Welcome, {user?.firstName}!</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-secondary"
                        >
                            📊 Dashboard
                        </button>
                        <button onClick={logout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Choose Your Language
                    </h2>
                    <p className="text-lg text-gray-600">
                        Start learning through real-life conversations
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading languages...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {languages.map((language) => (
                            <button
                                key={language._id}
                                onClick={() => handleLanguageSelect(language)}
                                className="card hover:shadow-xl transition-shadow cursor-pointer text-left group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-5xl">{language.flag}</span>
                                    <span className="text-sm px-3 py-1 rounded-full bg-primary-100 text-primary-700">
                                        {language.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                                    {language.name}
                                </h3>

                                <p className="text-xl text-gray-600 mb-4">{language.nativeScript}</p>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>📍 {language.region}</p>
                                    <p>👥 {(language.nativeSpeakers / 1000000).toFixed(0)}M speakers</p>
                                    <p>📚 {language.totalPhrases} phrases</p>
                                    <p>🎭 {language.totalSituations} situations</p>
                                </div>

                                <div className="mt-6 text-primary-600 font-medium flex items-center">
                                    Start Learning
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
