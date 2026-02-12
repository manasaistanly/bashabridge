import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { progressAPI } from '../services/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        try {
            const response = await progressAPI.getOverall();
            setProgress(response.data.data);
        } catch (error) {
            console.error('Failed to load progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLevelProgress = () => {
        if (!user) return 0;
        // Each level requires 500 XP
        const xpForCurrentLevel = user.totalXP % 500;
        return (xpForCurrentLevel / 500) * 100;
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary-600">📊 Dashboard</h1>
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/')} className="btn btn-secondary">
                            ← Languages
                        </button>
                        <button onClick={logout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        Welcome back, {user?.firstName}! 👋
                    </h2>
                    <p className="text-primary-100">
                        Keep up the great work on your language learning journey
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your progress...</p>
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Level Card */}
                            <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
                                <div className="text-center">
                                    <p className="text-sm text-purple-600 mb-2">Level</p>
                                    <p className="text-4xl font-bold text-purple-700 mb-2">
                                        {user?.level || 1}
                                    </p>
                                    <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all"
                                            style={{ width: `${getLevelProgress()}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-purple-600">
                                        {500 - (user?.totalXP % 500)} XP to Level {(user?.level || 1) + 1}
                                    </p>
                                </div>
                            </div>

                            {/* Total XP Card */}
                            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                                <div className="text-center">
                                    <p className="text-sm text-blue-600 mb-2">Total XP</p>
                                    <p className="text-4xl font-bold text-blue-700">
                                        {user?.totalXP || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Streak Card */}
                            <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
                                <div className="text-center">
                                    <p className="text-sm text-orange-600 mb-2">Current Streak</p>
                                    <p className="text-4xl font-bold text-orange-700">
                                        🔥 {user?.currentStreak || 0}
                                    </p>
                                    <p className="text-xs text-orange-600">days</p>
                                </div>
                            </div>

                            {/* Phrases Completed Card */}
                            <div className="card bg-gradient-to-br from-green-50 to-green-100">
                                <div className="text-center">
                                    <p className="text-sm text-green-600 mb-2">Phrases Completed</p>
                                    <p className="text-4xl font-bold text-green-700">
                                        {progress?.totalPhrasesCompleted || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Learning Summary */}
                        <div className="card mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Learning Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-primary-600">
                                        {progress?.languagesLearning || 0}
                                    </p>
                                    <p className="text-sm text-gray-600">Languages</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-primary-600">
                                        {progress?.totalAttempts || 0}
                                    </p>
                                    <p className="text-sm text-gray-600">Total Attempts</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-primary-600">
                                        {progress?.totalPhrasesCompleted || 0}
                                    </p>
                                    <p className="text-sm text-gray-600">Phrases Mastered</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-primary-600">
                                        {user?.level || 1}
                                    </p>
                                    <p className="text-sm text-gray-600">Current Level</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress by Language */}
                        {progress?.progressByLanguage && progress.progressByLanguage.length > 0 && (
                            <div className="card">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Progress by Language
                                </h3>
                                <div className="space-y-4">
                                    {progress.progressByLanguage.map((lang, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <div>
                                                    <p className="font-bold text-gray-800">
                                                        {lang.language?.name} - {lang.situation}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {lang.phrasesCompleted} phrases • {lang.averageAccuracy}% avg accuracy
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-primary-600 font-bold">+{lang.xpEarned} XP</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Progress Yet */}
                        {(!progress?.progressByLanguage || progress.progressByLanguage.length === 0) && (
                            <div className="card text-center py-12">
                                <p className="text-5xl mb-4">📚</p>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    Start Your Learning Journey!
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    You haven't started learning yet. Choose a language to begin!
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="btn btn-primary text-lg px-8"
                                >
                                    Choose Language
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
