import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="min-h-screen relative text-slate-50 font-body overflow-x-hidden selection:bg-indigo-500/30">
            {/* Background Gradients - Mobile optimized */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-slow" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative max-w-7xl mx-auto px-4 w-full"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
