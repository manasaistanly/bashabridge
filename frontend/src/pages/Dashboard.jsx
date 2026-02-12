import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Zap, TrendingUp, Calendar, ArrowLeft, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { progressAPI } from '../services/api';

const StatCard = ({ icon: Icon, label, value, subtext, color = "indigo" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-card p-6 rounded-2xl relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-5 text-${color}-500/20`}>
            <Icon className="w-24 h-24" />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-4 text-${color}-400`}>
                <Icon className="w-6 h-6" />
            </div>
            <p className="text-slate-400 text-sm mb-1">{label}</p>
            <h3 className="text-3xl font-bold font-display">{value}</h3>
            {subtext && <p className="text-xs text-slate-500 mt-2">{subtext}</p>}
        </div>
    </motion.div>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadProgress(); }, []);

    const loadProgress = async () => {
        try {
            const res = await progressAPI.getOverall();
            setProgress(res.data.data);
        } finally { setLoading(false); }
    };

    const getLevelProgress = () => {
        if (!user) return 0;
        const xpForCurrentLevel = user.totalXP % 500;
        return (xpForCurrentLevel / 500) * 100;
    };

    return (
        <div className="pb-12">
            <nav className="flex justify-between items-center py-6 mb-8">
                <button onClick={() => navigate('/')} className="btn-secondary px-4 py-2 rounded-xl flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Languages
                </button>
                <button onClick={logout} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400">
                    <LogOut className="w-5 h-5" />
                </button>
            </nav>

            {/* Welcome Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 rounded-3xl mb-8 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/20 relative overflow-hidden"
            >
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h1>
                    <p className="text-indigo-200 mb-6 max-w-xl">
                        You're doing great! Keep up the momentum to reach your next level.
                    </p>

                    <div className="max-w-md">
                        <div className="flex justify-between text-sm mb-2 text-indigo-200">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatCard icon={Trophy} label="Total XP" value={user?.totalXP || 0} color="yellow" />
                        <StatCard icon={Zap} label="Current Streak" value={`${user?.currentStreak || 0} Days`} color="orange" />
                        <StatCard icon={Target} label="Phrases Mastered" value={progress?.totalPhrasesCompleted || 0} color="green" />
                        <StatCard icon={Star} label="Total Attempts" value={progress?.totalAttempts || 0} color="purple" />
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
                                className="glass-card p-6 rounded-2xl flex items-center justify-between"
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

                                <div className="flex items-center gap-8">
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
