import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Users, BookOpen, Mic } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useLearningStore from '../store/learningStore';
import { languageAPI } from '../services/api';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

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
        <div className="pb-12">
            {/* Navbar */}
            <nav className="flex justify-between items-center py-6 mb-12">
                <div className="flex items-center gap-2">
                    <img src="/logo.svg" alt="BhashaBridge" className="w-10 h-10 drop-shadow-lg" />
                    <span className="text-xl font-bold font-display tracking-tight">BhashaBridge</span>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                    </button>
                    <button
                        onClick={logout}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="text-center mb-16 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display">
                        Master India's <br />
                        <span className="text-gradient">Languages Naturally</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                        Learn through immersive everyday situations. Select a language below to start your journey.
                    </p>
                </motion.div>
            </div>

            {/* Language Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {languages.map((language) => (
                        <motion.button
                            key={language._id}
                            variants={item}
                            onClick={() => handleLanguageSelect(language)}
                            className="group glass-card text-left relative overflow-hidden p-6 rounded-3xl hover:bg-white/5"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <span className="text-9xl font-display">{language.nativeScript?.charAt(0)}</span>
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl shadow-inner border border-white/5">
                                        {language.flag}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${language.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300 border border-green-500/20' :
                                        language.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/20' :
                                            'bg-red-500/20 text-red-300 border border-red-500/20'
                                        }`}>
                                        {language.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold mb-1">{language.name}</h3>
                                <p className="text-slate-400 font-display mb-6">{language.nativeScript}</p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-slate-400">
                                        <Users className="w-4 h-4 text-indigo-400" />
                                        <span>{(language.nativeSpeakers / 1000000).toFixed(0)}M Speakers</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-400">
                                        <BookOpen className="w-4 h-4 text-pink-400" />
                                        <span>{language.totalPhrases} Phrases</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-400">
                                        <Mic className="w-4 h-4 text-cyan-400" />
                                        <span>{language.totalSituations} Situations</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between group-hover:text-indigo-400 transition-colors">
                                    <span className="font-semibold">Start Learning</span>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
