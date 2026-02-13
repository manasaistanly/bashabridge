import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, Send, Volume2, Globe, Bot, User, Sparkles, StopCircle, RefreshCw } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useLearningStore from '../store/learningStore';
import api from '../services/api';

export default function Chat() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { selectedLanguage, languages, fetchLanguages, setLanguage } = useLearningStore();

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initial greeting and language check
    useEffect(() => {
        // Always fetch languages if we don't have them all (e.g. initial load or stale state)
        if (languages.length < 2) {
            fetchLanguages();
        }

        if (!selectedLanguage && languages.length > 0) {
            setLanguage(languages[0]);
        }
    }, [languages.length, selectedLanguage, fetchLanguages, setLanguage]);

    useEffect(() => {
        if (selectedLanguage) {
            setMessages([
                {
                    id: 1,
                    sender: 'ai',
                    text: `Hello! I'm your ${selectedLanguage.name} tutor. Let's practice conversation!`,
                    translation: `Namaste! I am your ${selectedLanguage.name} tutor.`,
                    audio: null
                }
            ]);
        }
    }, [selectedLanguage?._id]);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;

            const langCodeMap = {
                'ta': 'ta-IN', 'te': 'te-IN', 'hi': 'hi-IN',
                'kn': 'kn-IN', 'ml': 'ml-IN', 'mr': 'mr-IN'
            };
            recognition.lang = selectedLanguage ? langCodeMap[selectedLanguage.code] || 'en-US' : 'en-US';

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setInputText(transcript);
                if (event.results[0].isFinal) {
                    setIsListening(false);
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, [selectedLanguage]);

    // Load speech synthesis voices
    useEffect(() => {
        if (window.speechSynthesis) {
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                console.log('Loaded', voices.length, 'voices');
            };

            if (window.speechSynthesis.getVoices().length === 0) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            } else {
                loadVoices();
            }
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedLanguage) return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputText,
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await api.post('/chat', {
                message: userMessage.text,
                languageId: selectedLanguage._id
            });

            const data = response.data.data;

            const aiMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                text: data.message,
                translation: data.translation,
                audio: data.audio
            };

            setMessages(prev => [...prev, aiMessage]);
            speakText(data.audio, selectedLanguage.code);

        } catch (error) {
            console.error('Chat error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setInputText('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakText = (text, langCode) => {
        if (!text) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        setIsSpeaking(true);

        const langMap = {
            'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN',
            'kn': 'kn-IN', 'ml': 'ml-IN', 'mr': 'mr-IN',
            'bn': 'bn-IN', 'gu': 'gu-IN', 'pa': 'pa-IN', 'ur': 'ur-IN'
        };

        utterance.lang = langMap[langCode] || 'en-IN';
        utterance.rate = 0.9;

        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.lang.startsWith(langCode) || v.lang === langMap[langCode]);

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        } else {
            console.warn(`Native voice for ${langCode} not found. Using fallback.`);
        }

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="h-screen flex flex-col relative overflow-hidden bg-slate-950 text-white">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.15),transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl opacity-30 animate-pulse" />
                <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-3xl opacity-30 animate-pulse delay-700" />
            </div>

            {/* Header */}
            <header className="relative z-10 px-4 py-4 md:px-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/dashboard')}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                            aria-label="Back to Dashboard"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-300" />
                        </motion.button>
                        <div>
                            <h1 className="font-bold text-xl flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                                AI Tutor
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
                                {isLoading ? 'Generating response...' : `Practicing ${selectedLanguage?.name}`}
                            </div>
                        </div>
                    </div>

                    {/* Language Switcher */}
                    <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-white/5">
                        {languages.map(lang => (
                            <motion.button
                                key={lang._id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setLanguage(lang)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${selectedLanguage?._id === lang._id ? 'bg-white/10 shadow-lg scale-110' : 'opacity-40 hover:opacity-100'}`}
                                title={lang.name}
                                aria-label={`Switch to ${lang.name}`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto px-4 md:px-0 scroll-smooth relative z-0">
                <div className="max-w-3xl mx-auto py-6 space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg ${msg.sender === 'user'
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                        }`}>
                                        {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`p-4 rounded-2xl shadow-xl backdrop-blur-sm border ${msg.sender === 'user'
                                        ? 'bg-indigo-600/90 text-white rounded-tr-none border-indigo-500/30'
                                        : 'bg-slate-800/80 text-slate-100 rounded-tl-none border-white/10'
                                        }`}>
                                        <p className="text-lg leading-relaxed">{msg.text}</p>

                                        {msg.sender === 'ai' && (
                                            <div className="mt-3 pt-3 border-t border-white/10">
                                                <p className="text-sm text-emerald-300 font-medium mb-1">Translation:</p>
                                                <p className="text-sm text-slate-300 italic mb-3">{msg.translation}</p>

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => speakText(msg.audio, selectedLanguage?.code)}
                                                    className={`p-2 rounded-full transition-all flex items-center gap-2 text-xs font-semibold ${isSpeaking
                                                        ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50'
                                                        : 'bg-white/10 hover:bg-white/20 text-slate-300'
                                                        }`}
                                                    aria-label="Listen to pronunciation"
                                                >
                                                    {isSpeaking ? (
                                                        <>
                                                            <StopCircle className="w-4 h-4 animate-pulse" />
                                                            <span>Playing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Volume2 className="w-4 h-4" />
                                                            <span>Listen</span>
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start pl-12"
                        >
                            <div className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5 shadow-lg">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </main>

            {/* Input Area */}
            <div className="relative z-10 p-4 md:p-6 bg-gradient-to-t from-slate-950 to-transparent">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSendMessage} className="relative group">
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur ${isListening ? 'opacity-50 animate-pulse' : ''}`}></div>
                        <div className="relative flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl">

                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleListening}
                                className={`p-3 rounded-xl transition-all ${isListening
                                    ? 'bg-red-500/20 text-red-500 ring-1 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                    }`}
                                title={isListening ? "Stop Listening" : "Start Voice Input"}
                                aria-label={isListening ? "Stop Listening" : "Start Voice Input"}
                            >
                                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                            </motion.button>

                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={isListening ? "Listening..." : `Message in ${selectedLanguage?.name || 'English'}...`}
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 px-2 py-2 text-lg"
                                disabled={isLoading}
                                aria-label="Type your message"
                            />

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={!inputText.trim() || isLoading}
                                className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                                aria-label="Send Message"
                            >
                                <Send className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </form>
                    <p className="text-center text-xs text-slate-500 mt-3">
                        AI can make mistakes. Review generated translations.
                    </p>
                </div>
            </div>
        </div>
    );
}
