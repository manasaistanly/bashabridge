import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Lock, ArrowLeft } from 'lucide-react';
import useGameStore from '../store/gameStore';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const item = {
    hidden: { scale: 0.8, opacity: 0 },
    show: { scale: 1, opacity: 1 }
};

export default function Achievements() {
    const navigate = useNavigate();
    const { achievements, fetchAchievements } = useGameStore();

    useEffect(() => {
        fetchAchievements();
    }, []);

    const getCategoryEmoji = (type) => {
        const emojiMap = {
            milestone: '🎯',
            streak: '🔥',
            accuracy: '✨',
            language: '🌍',
            special: '⭐'
        };
        return emojiMap[type] || '🏆';
    };

    const groupedAchievements = achievements.reduce((acc, achievement) => {
        if (!acc[achievement.type]) acc[achievement.type] = [];
        acc[achievement.type].push(achievement);
        return acc;
    }, {});

    return (
        <div className="pb-12 px-4 md:px-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold font-display">Achievements</h1>
                        <p className="text-slate-400 mt-1 text-sm md:text-base">
                            {achievements.filter(a => a.unlocked).length} / {achievements.length} unlocked
                        </p>
                    </div>
                </div>
                <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
            </div>

            {/* Achievement Categories */}
            {Object.entries(groupedAchievements).map(([type, typeAchievements]) => (
                <div key={type} className="mb-8 md:mb-10">
                    <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-xl md:text-2xl">{getCategoryEmoji(type)}</span>
                        <span className="capitalize">{type}</span>
                    </h2>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {typeAchievements.map((achievement) => (
                            <motion.div
                                key={achievement._id}
                                variants={item}
                                className={`glass-card p-4 md:p-6 rounded-2xl relative overflow-hidden ${achievement.unlocked ? 'border-yellow-500/20' : 'opacity-60'
                                    }`}
                            >
                                {/* Unlock Status */}
                                {!achievement.unlocked && (
                                    <div className="absolute top-4 right-4">
                                        <Lock className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
                                    </div>
                                )}

                                {/* Icon */}
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-4xl mb-4 ${achievement.unlocked
                                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                                    : 'bg-white/5 border border-white/5'
                                    }`}>
                                    {achievement.icon}
                                </div>

                                {/* Details */}
                                <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">{achievement.name}</h3>
                                <p className="text-xs md:text-sm text-slate-400 mb-3 md:mb-4">{achievement.description}</p>

                                {/* Progress */}
                                {!achievement.unlocked && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>Progress</span>
                                            <span>{achievement.progress} / {achievement.requirement}</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                                                style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Reward */}
                                {achievement.unlocked && (
                                    <div className="flex items-center gap-2 text-xs md:text-sm text-yellow-400">
                                        <Trophy className="w-3 h-3 md:w-4 md:h-4" />
                                        <span>+{achievement.xpReward} XP</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            ))}
        </div>
    );
}
