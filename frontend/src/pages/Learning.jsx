import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, ArrowRight, ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import useLearningStore from '../store/learningStore';
import useAuthStore from '../store/authStore';
import { phraseAPI } from '../services/api';

export default function Learning() {
    const navigate = useNavigate();
    const {
        selectedLanguage,
        selectedSituation,
        situations,
        phrases,
        currentPhraseIndex,
        setSituation,
        fetchPhrases,
        nextPhrase,
        previousPhrase
    } = useLearningStore();

    const [isListening, setIsListening] = useState(false);
    const [userTranscript, setUserTranscript] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!selectedLanguage) navigate('/');
    }, [selectedLanguage, navigate]);

    const handleSituationSelect = async (situation) => {
        setSituation(situation.name);
        await fetchPhrases(selectedLanguage._id, situation.name);
    };

    const handlePlayPhrase = () => {
        if ('speechSynthesis' in window && phrases[currentPhraseIndex]) {
            setIsPlaying(true);
            const utterance = new SpeechSynthesisUtterance(phrases[currentPhraseIndex].local);
            const voices = window.speechSynthesis.getVoices();
            const indianVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.startsWith('ta'));
            if (indianVoice) utterance.voice = indianVoice;
            utterance.rate = 0.8;
            utterance.onend = () => setIsPlaying(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleStartListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = selectedLanguage.code + '-IN';
            recognition.onstart = () => { setIsListening(true); setUserTranscript(''); setFeedback(null); };
            recognition.onresult = async (e) => {
                const transcript = e.results[0][0].transcript;
                setUserTranscript(transcript);
                try {
                    const res = await phraseAPI.submitAttempt(phrases[currentPhraseIndex]._id, { userTranscript: transcript });
                    setFeedback(res.data.data);
                } catch (err) { console.error(err); }
            };
            recognition.onend = () => setIsListening(false);
            recognition.start();
        }
    };

    if (!selectedLanguage) return null;

    return (
        <div className="pb-12 min-h-[90vh] flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center py-6">
                <button onClick={() => navigate('/')} className="btn-secondary px-4 py-2 rounded-xl flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold">{selectedLanguage.flag} {selectedLanguage.name}</h2>
                    {selectedSituation && <span className="text-sm text-slate-400">{selectedSituation}</span>}
                </div>
                <div className="w-[88px]" /> {/* Spacer */}
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center">
                {!selectedSituation ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto w-full">
                        <h2 className="text-3xl font-bold mb-8 text-center">Choose a Scenario</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {situations.map((situation, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => handleSituationSelect(situation)}
                                    className="glass-card p-8 text-left hover:bg-white/5 group"
                                >
                                    <h3 className="text-2xl font-bold mb-2">{situation.name}</h3>
                                    <p className="text-slate-400 mb-6">{situation.phraseCount} phrases • {situation.difficulty}</p>
                                    <div className="flex items-center gap-2 text-indigo-400 font-medium group-hover:gap-4 transition-all">
                                        Start Practice <ArrowRight className="w-4 h-4" />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : phrases[currentPhraseIndex] && (
                    <motion.div
                        key={currentPhraseIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-2xl mx-auto w-full"
                    >
                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentPhraseIndex + 1) / phrases.length) * 100}%` }}
                                    className="h-full bg-indigo-500"
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-slate-500">
                                <span>Phrase {currentPhraseIndex + 1}/{phrases.length}</span>
                                <span>{Math.round(((currentPhraseIndex + 1) / phrases.length) * 100)}%</span>
                            </div>
                        </div>

                        {/* Learning Card */}
                        <div className="glass-card p-10 rounded-[2rem] text-center mb-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                            <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-6">
                                English
                            </span>
                            <h3 className="text-2xl font-medium text-slate-300 mb-8">"{phrases[currentPhraseIndex].english}"</h3>

                            <div className="py-8 border-t border-b border-white/5 mb-8 bg-slate-800/20 rounded-2xl mx-[-1rem] px-[1rem]">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display text-gradient">
                                    {phrases[currentPhraseIndex].local}
                                </h2>
                                <p className="text-indigo-200/60 font-medium text-lg">
                                    {phrases[currentPhraseIndex].transliteration}
                                </p>
                            </div>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handlePlayPhrase}
                                    disabled={isPlaying}
                                    className="p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <Volume2 className={`w-8 h-8 ${isPlaying ? 'animate-pulse' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={handleStartListening}
                                disabled={isListening}
                                className={`w-full py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isListening
                                        ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
                                        : userTranscript
                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                                    }`}
                            >
                                <Mic className="w-6 h-6" />
                                {isListening ? 'Listening...' : userTranscript ? 'Try Again' : 'Tap to Speak'}
                            </button>

                            {/* Feedback Area */}
                            <AnimatePresence>
                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-6 rounded-2xl border ${feedback.accuracy >= 70
                                                ? 'bg-green-500/10 border-green-500/20 text-green-200'
                                                : 'bg-orange-500/10 border-orange-500/20 text-orange-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 mb-2">
                                            {feedback.accuracy >= 70 ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                            <span className="text-2xl font-bold">{feedback.accuracy}% Match</span>
                                        </div>
                                        <p className="text-sm opacity-80">{feedback.feedbackMessage}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={previousPhrase}
                                disabled={currentPhraseIndex === 0}
                                className="btn-secondary px-6 py-3 rounded-xl disabled:opacity-30"
                            >
                                Previous
                            </button>
                            <button
                                onClick={nextPhrase}
                                disabled={currentPhraseIndex === phrases.length - 1}
                                className="btn-secondary px-6 py-3 rounded-xl disabled:opacity-30 flex items-center gap-2"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
