import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Zap, TrendingUp, Calendar, ArrowLeft, LogOut, Medal, Flame, Bot } from 'lucide-react';
import { triggerConfetti } from '../components/Celebration';
import useAuthStore from '../store/authStore';
import useGameStore from '../store/gameStore';
import useLearningStore from '../store/learningStore';
import { progressAPI } from '../services/api';

const StatCard = ({ icon: Icon, label, value, subtext, color = "indigo" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-card p-4 md:p-6 rounded-2xl relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-5 text-${color}-500/20`}>
            <Icon className="w-16 h-16 md:w-24 md:h-24" />
        </div>
        <div className="relative z-10">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-3 md:mb-4 text-${color}-400`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <p className="text-slate-400 text-xs md:text-sm mb-1">{label}</p>
            <h3 className="text-2xl md:text-3xl font-bold font-display">{value}</h3>
            {subtext && <p className="text-xs text-slate-500 mt-2">{subtext}</p>}
        </div>
    </motion.div>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { dailyChallenge, challengeProgress, fetchDailyChallenge, fetchAchievements } = useGameStore();
    const { setLanguage, selectedLanguage } = useLearningStore();
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        // Trigger confetti if it's a new day or just for fun on load (for prototype wow factor)
        // In real app, check for level up
    }, []);

    useEffect(() => {
        if (user?.level > 1) {
            // Simple check: if we loaded and level > 1, maybe they leveled up recently?
            // For this prototype, let's just trigger it on the 'Claim Reward' or similar.
            // But for now, let's trigger it if they have high XP as a welcome.
            if (user.totalXP % 500 === 0 && user.totalXP > 0) {
                triggerConfetti();
            }
        }
    }, [user?.totalXP]);

    const loadData = async () => {
        try {
            await Promise.all([
                progressAPI.getOverall(),
                fetchDailyChallenge(),
                fetchAchievements()
            ]).then(([res]) => {
                setProgress(res.data.data);
            });
        } finally { setLoading(false); }
    };

    const handleStartChallenge = () => {
        // If we have a selected language, just go
        if (selectedLanguage) {
            navigate('/learn');
            return;
        }

        // If we have progress history, pick the most recent/first language
        if (progress?.progressByLanguage?.length > 0) {
            const lastLanguage = progress.progressByLanguage[0].language;
            if (lastLanguage) {
                setLanguage(lastLanguage);
                navigate('/learn');
                return;
            }
        }

        // Otherwise go to selection
        navigate('/');
    };

    const getLevelProgress = () => {
        if (!user) return 0;
        const xpForCurrentLevel = user.totalXP % 500;
        return (xpForCurrentLevel / 500) * 100;
    };

    return (
        <div className="pb-12 px-4 md:px-0">
            <nav className="flex justify-between items-center py-4 md:py-6 mb-6 md:mb-8">
                <button onClick={() => navigate('/')} className="btn-secondary px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 text-sm md:text-base">
                    <ArrowLeft className="w-4 h-4" /> <span className="hidden md:inline">Back to Languages</span><span className="md:hidden">Back</span>
                </button>
                <button onClick={logout} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400">
                    <LogOut className="w-5 h-5" />
                </button>
            </nav>

            {/* Welcome Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 md:p-8 rounded-3xl mb-8 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/20 relative overflow-hidden"
            >
                <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h1>
                    <p className="text-indigo-200 mb-6 max-w-xl text-sm md:text-base">
                        You're doing great! Keep up the momentum to reach your next level.
                    </p>

                    <div className="max-w-md">
                        <div className="flex justify-between text-xs md:text-sm mb-2 text-indigo-200">
                            <span>Level {user?.level || 1}</span>
                            <span>{500 - (user?.totalXP % 500)} XP to next level</span>
                        </div>
                        <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${getLevelProgress()}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-indigo-400 to-pink-400"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin text-indigo-500 w-8 h-8 rounded-full border-2 border-current border-t-transparent" /></div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                        <StatCard icon={Trophy} label="Total XP" value={user?.totalXP || 0} color="yellow" />
                        <StatCard icon={Zap} label="Streak" value={`${user?.currentStreak || 0}d`} subtext="Keep it up!" color="orange" />
                        <StatCard icon={Target} label="Mastered" value={progress?.totalPhrasesCompleted || 0} color="green" />
                        <StatCard icon={Star} label="Attempts" value={progress?.totalAttempts || 0} color="purple" />
                    </div>

                    {/* Gamification Section */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8 md:mb-12">
                        {/* Daily Challenge */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-2 glass-card p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-indigo-800/40"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Flame className="w-24 h-24 md:w-32 md:h-32 text-orange-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <Flame className="w-6 h-6 text-orange-400" />
                                            Daily Challenge
                                        </h3>
                                        <p className="text-indigo-200 text-sm">Resets in 12h 30m</p>
                                    </div>
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-yellow-400 self-start md:self-auto">
                                        +{dailyChallenge?.xpReward || 100} XP
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-lg font-bold mb-2">{dailyChallenge?.description || "Complete 5 phrases today"}</h4>
                                    <div className="h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (challengeProgress / (dailyChallenge?.target || 5)) * 100)}%` }}
                                            className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm text-slate-400">
                                        <span>{challengeProgress} / {dailyChallenge?.target || 5} completed</span>
                                        <span>{Math.round((challengeProgress / (dailyChallenge?.target || 5)) * 100)}%</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleStartChallenge}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 font-bold hover:shadow-lg hover:shadow-orange-500/20 transition-all text-sm md:text-base"
                                >
                                    Start Challenge
                                </button>
                            </div>
                        </motion.div>

                        {/* Achievements Link */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            onClick={() => navigate('/achievements')}
                            className="glass-card p-6 rounded-2xl relative overflow-hidden cursor-pointer group hover:bg-white/10 transition-all"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col items-center justify-center h-full text-center relative z-10 py-4 md:py-0">
                                <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-4 text-yellow-400 group-hover:scale-110 transition-transform">
                                    <Medal className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Achievements</h3>
                                <p className="text-slate-400 text-sm mb-4">View your badges and milestones</p>
                                <span className="text-yellow-400 text-sm font-bold flex items-center gap-1">
                                    View Collection <ArrowLeft className="w-4 h-4 rotate-180" />
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8 md:mb-12">
                        {/* AI Tutor Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            onClick={() => navigate('/chat')}
                            className="glass-card p-6 rounded-2xl relative overflow-hidden cursor-pointer group bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Bot className="w-24 h-24 text-indigo-400" />
                            </div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Bot className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">AI Tutor Chat</h3>
                                    <p className="text-indigo-200 text-sm">Practice conversation with AI</p>
                                </div>
                                <div className="ml-auto">
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white group-hover:bg-white/20 transition-colors">
                                        New
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        Learning Activity
                    </h2>

                    <div className="grid gap-4">
                        {progress?.progressByLanguage.map((lang, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                                        {lang.language?.flag}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{lang.language?.name}</h3>
                                        <p className="text-slate-400 text-sm">{lang.situation}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Accuracy</p>
                                        <p className={`font-bold font-display ${lang.averageAccuracy >= 80 ? 'text-green-400' : 'text-yellow-400'
                                            }`}>{lang.averageAccuracy}%</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">XP Earned</p>
                                        <p className="font-bold font-display text-indigo-400">+{lang.xpEarned}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {(!progress?.progressByLanguage || progress.progressByLanguage.length === 0) && (
                        <div className="text-center py-12 glass-card rounded-3xl border-dashed border-2 border-slate-700">
                            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">No activity yet. Start your first lesson!</p>
                            <button onClick={() => navigate('/')} className="mt-4 btn-primary px-6 py-2 rounded-xl text-sm">
                                Start Learning
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
