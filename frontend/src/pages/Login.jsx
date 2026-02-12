import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        const result = await login(formData.email, formData.password);
        if (result.success) navigate('/');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block p-4 rounded-full bg-white/5 mb-6 border border-white/10"
                    >
                        <Globe className="w-12 h-12 text-indigo-400" />
                    </motion.div>

                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 text-transparent bg-clip-text">
                        Welcome Back
                    </h1>
                    <p className="text-slate-400">Continue your language journey</p>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8 rounded-3xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full glass-input pl-11"
                                    placeholder="your@email.com"
                                    required
                                />
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full glass-input pl-11"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Start Learning</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400">
                            New to BhashaBridge?{' '}
                            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
